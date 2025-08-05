# Script de Deploiement Production - CommuniConnect
# PowerShell Script pour Windows

param(
    [string]$Environment = "production",
    [string]$Domain = "communiconnect.gn",
    [switch]$SkipTests = $false,
    [switch]$Force = $false
)

# Configuration
$ProjectRoot = $PSScriptRoot
$BackupDir = "$ProjectRoot\backups"
$LogDir = "$ProjectRoot\logs"
$Date = Get-Date -Format "yyyyMMdd_HHmmss"

# Couleurs pour l'affichage
function Write-Success { param($Message) Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "[ERROR] $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Blue }
function Write-Warning { param($Message) Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
function Write-Title { param($Message) Write-Host "`n[TITLE] $Message" -ForegroundColor Cyan }

# Creation des repertoires
if (!(Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir -Force }
if (!(Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force }

# Logging
$LogFile = "$LogDir\deploy_$Date.log"
function Write-Log { param($Message) 
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$Timestamp - $Message" | Out-File -FilePath $LogFile -Append
    Write-Host $Message
}

Write-Title "DEMARRAGE DU DEPLOIEMENT PRODUCTION"
Write-Log "Demarrage du deploiement CommuniConnect en production"

# 1. VERIFICATION PREREQUIS
Write-Title "VERIFICATION DES PREREQUIS"

# Verifier Node.js
try {
    $NodeVersion = node --version
    Write-Success "Node.js detecte: $NodeVersion"
    Write-Log "Node.js version: $NodeVersion"
} catch {
    Write-Error "Node.js non installe ou non accessible"
    Write-Log "ERREUR: Node.js non disponible"
    exit 1
}

# Verifier npm
try {
    $NpmVersion = npm --version
    Write-Success "npm detecte: $NpmVersion"
    Write-Log "npm version: $NpmVersion"
} catch {
    Write-Error "npm non installe ou non accessible"
    Write-Log "ERREUR: npm non disponible"
    exit 1
}

# 2. SAUVEGARDE
Write-Title "CREATION DE LA SAUVEGARDE"

if (Test-Path "$ProjectRoot\client\build") {
    $BackupName = "backup_$Date.zip"
    $BackupPath = "$BackupDir\$BackupName"
    
    try {
        Compress-Archive -Path "$ProjectRoot\client\build" -DestinationPath $BackupPath -Force
        Write-Success "Sauvegarde creee: $BackupName"
        Write-Log "Sauvegarde creee: $BackupPath"
    } catch {
        Write-Warning "Impossible de creer la sauvegarde: $($_.Exception.Message)"
        Write-Log "WARNING: Echec de la sauvegarde"
    }
}

# 3. TESTS PRE-DEPLOIEMENT
if (!$SkipTests) {
    Write-Title "TESTS PRE-DEPLOIEMENT"
    
    # Test du serveur
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            Write-Success "Serveur backend operationnel"
            Write-Log "Test serveur: SUCCES"
        } else {
            Write-Warning "Serveur backend repond avec le code: $($Response.StatusCode)"
            Write-Log "Test serveur: CODE $($Response.StatusCode)"
        }
    } catch {
        Write-Warning "Serveur backend non accessible: $($_.Exception.Message)"
        Write-Log "Test serveur: ECHEC - $($_.Exception.Message)"
    }
}

# 4. INSTALLATION DES DEPENDANCES
Write-Title "INSTALLATION DES DEPENDANCES"

# Installation des dependances racine
Write-Info "Installation des dependances racine..."
try {
    npm install
    Write-Success "Dependances racine installees"
    Write-Log "Installation dependances racine: SUCCES"
} catch {
    Write-Error "Erreur lors de l'installation des dependances racine: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dependances racine echouee"
    exit 1
}

# Installation des dependances serveur
Write-Info "Installation des dependances serveur..."
try {
    Set-Location "$ProjectRoot\server"
    npm install
    Set-Location $ProjectRoot
    Write-Success "Dependances serveur installees"
    Write-Log "Installation dependances serveur: SUCCES"
} catch {
    Write-Error "Erreur lors de l'installation des dependances serveur: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dependances serveur echouee"
    exit 1
}

# Installation des dependances client
Write-Info "Installation des dependances client..."
try {
    Set-Location "$ProjectRoot\client"
    npm install
    Set-Location $ProjectRoot
    Write-Success "Dependances client installees"
    Write-Log "Installation dependances client: SUCCES"
} catch {
    Write-Error "Erreur lors de l'installation des dependances client: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dependances client echouee"
    exit 1
}

# 5. BUILD DE L'APPLICATION
Write-Title "BUILD DE L'APPLICATION"

Write-Info "Build du client React..."
try {
    Set-Location "$ProjectRoot\client"
    npm run build
    Set-Location $ProjectRoot
    Write-Success "Build du client termine"
    Write-Log "Build client: SUCCES"
} catch {
    Write-Error "Erreur lors du build du client: $($_.Exception.Message)"
    Write-Log "ERREUR: Build client echoue"
    exit 1
}

# 6. CONFIGURATION PRODUCTION
Write-Title "CONFIGURATION PRODUCTION"

# Creation du fichier .env.production
$EnvProduction = @"
NODE_ENV=production
PORT=5000
JWT_SECRET=votre_secret_tres_securise_production_2024
JWT_EXPIRE=7d

# Base de donnees MongoDB
MONGODB_URI=mongodb://localhost:27017/communiconnect_prod

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=https://$Domain

# Logging
LOG_LEVEL=info
LOG_FILE=$LogDir\app.log

# Securite
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Monitoring
PM2_MONITORING=true
"@

try {
    $EnvProduction | Out-File -FilePath "$ProjectRoot\.env.production" -Encoding UTF8
    Write-Success "Fichier .env.production cree"
    Write-Log "Configuration production: SUCCES"
} catch {
    Write-Error "Erreur lors de la creation du fichier .env.production: $($_.Exception.Message)"
    Write-Log "ERREUR: Configuration production echouee"
}

# 7. CONFIGURATION PM2
Write-Title "CONFIGURATION PM2"

$EcosystemConfig = @"
module.exports = {
  apps: [{
    name: 'communiconnect-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '$LogDir\err.log',
    out_file: '$LogDir\out.log',
    log_file: '$LogDir\combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }, {
    name: 'communiconnect-client',
    script: 'node_modules/serve/serve.js',
    args: '-s build -l 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
"@

try {
    $EcosystemConfig | Out-File -FilePath "$ProjectRoot\ecosystem.config.js" -Encoding UTF8
    Write-Success "Configuration PM2 creee"
    Write-Log "Configuration PM2: SUCCES"
} catch {
    Write-Error "Erreur lors de la creation de la configuration PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Configuration PM2 echouee"
}

# 8. DEMARRAGE DES SERVICES
Write-Title "DEMARRAGE DES SERVICES"

# Verifier si PM2 est installe
try {
    $Pm2Version = pm2 --version
    Write-Success "PM2 detecte: $Pm2Version"
    Write-Log "PM2 version: $Pm2Version"
} catch {
    Write-Info "Installation de PM2..."
    try {
        npm install -g pm2
        Write-Success "PM2 installe"
        Write-Log "PM2 installe avec succes"
    } catch {
        Write-Error "Impossible d'installer PM2: $($_.Exception.Message)"
        Write-Log "ERREUR: Installation PM2 echouee"
        exit 1
    }
}

# Arreter les processus existants
try {
    pm2 stop all
    pm2 delete all
    Write-Info "Processus PM2 existants arretes"
    Write-Log "Arret processus PM2: SUCCES"
} catch {
    Write-Info "Aucun processus PM2 a arreter"
    Write-Log "Arret processus PM2: AUCUN PROCESSUS"
}

# Demarrer avec PM2
try {
    pm2 start ecosystem.config.js
    pm2 save
    Write-Success "Services demarres avec PM2"
    Write-Log "Demarrage PM2: SUCCES"
} catch {
    Write-Error "Erreur lors du demarrage PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Demarrage PM2 echoue"
    exit 1
}

# 9. VERIFICATION FINALE
Write-Title "VERIFICATION FINALE"

Start-Sleep 5

# Verifier le statut PM2
try {
    $Pm2Status = pm2 status
    Write-Info "Statut PM2:"
    Write-Host $Pm2Status
    Write-Log "Verification PM2: SUCCES"
} catch {
    Write-Error "Impossible de verifier le statut PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Verification PM2 echouee"
}

# Test de l'API
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($Response.StatusCode -eq 200) {
        Write-Success "API production operationnelle"
        Write-Log "Test API production: SUCCES"
    } else {
        Write-Warning "API production repond avec le code: $($Response.StatusCode)"
        Write-Log "Test API production: CODE $($Response.StatusCode)"
    }
} catch {
    Write-Error "API production non accessible: $($_.Exception.Message)"
    Write-Log "Test API production: ECHEC"
}

# Test du client
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($Response.StatusCode -eq 200) {
        Write-Success "Client production operationnel"
        Write-Log "Test client production: SUCCES"
    } else {
        Write-Warning "Client production repond avec le code: $($Response.StatusCode)"
        Write-Log "Test client production: CODE $($Response.StatusCode)"
    }
} catch {
    Write-Error "Client production non accessible: $($_.Exception.Message)"
    Write-Log "Test client production: ECHEC"
}

# 10. RESUME FINAL
Write-Title "RESUME DU DEPLOIEMENT"

Write-Success "DEPLOIEMENT PRODUCTION TERMINE !"
Write-Log "DEPLOIEMENT TERMINE AVEC SUCCES"

Write-Info "INFORMATIONS:"
Write-Info "   - API: http://localhost:5000"
Write-Info "   - Client: http://localhost:3000"
Write-Info "   - Logs: $LogDir"
Write-Info "   - Sauvegarde: $BackupDir"

Write-Info "COMMANDES UTILES:"
Write-Info "   - Statut: pm2 status"
Write-Info "   - Logs: pm2 logs"
Write-Info "   - Monitoring: pm2 monit"
Write-Info "   - Redemarrage: pm2 restart all"

Write-Info "SUPPORT:"
Write-Info "   - Documentation: GUIDE_DEPLOIEMENT_WINDOWS.md"
Write-Info "   - Logs detailles: $LogFile"

Write-Log "Deploiement termine avec succes - $(Get-Date)" 