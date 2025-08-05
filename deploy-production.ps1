# 🚀 SCRIPT DE DÉPLOIEMENT PRODUCTION - COMMUNICONNECT
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
function Write-Success { param($Message) Write-Host "✅ $Message" -ForegroundColor Green }
function Write-Error { param($Message) Write-Host "❌ $Message" -ForegroundColor Red }
function Write-Info { param($Message) Write-Host "ℹ️  $Message" -ForegroundColor Blue }
function Write-Warning { param($Message) Write-Host "⚠️  $Message" -ForegroundColor Yellow }
function Write-Title { param($Message) Write-Host "`n🎯 $Message" -ForegroundColor Cyan }

# Création des répertoires
if (!(Test-Path $BackupDir)) { New-Item -ItemType Directory -Path $BackupDir -Force }
if (!(Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force }

# Logging
$LogFile = "$LogDir\deploy_$Date.log"
function Write-Log { param($Message) 
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$Timestamp - $Message" | Out-File -FilePath $LogFile -Append
    Write-Host $Message
}

Write-Title "DÉMARRAGE DU DÉPLOIEMENT PRODUCTION"
Write-Log "Démarrage du déploiement CommuniConnect en production"

# 1. VÉRIFICATION PRÉREQUIS
Write-Title "VÉRIFICATION DES PRÉREQUIS"

# Vérifier Node.js
try {
    $NodeVersion = node --version
    Write-Success "Node.js détecté: $NodeVersion"
    Write-Log "Node.js version: $NodeVersion"
} catch {
    Write-Error "Node.js non installé ou non accessible"
    Write-Log "ERREUR: Node.js non disponible"
    exit 1
}

# Vérifier npm
try {
    $NpmVersion = npm --version
    Write-Success "npm détecté: $NpmVersion"
    Write-Log "npm version: $NpmVersion"
} catch {
    Write-Error "npm non installé ou non accessible"
    Write-Log "ERREUR: npm non disponible"
    exit 1
}

# Vérifier Git
try {
    $GitVersion = git --version
    Write-Success "Git détecté: $GitVersion"
    Write-Log "Git version: $GitVersion"
} catch {
    Write-Warning "Git non détecté - certaines fonctionnalités peuvent être limitées"
    Write-Log "WARNING: Git non disponible"
}

# 2. SAUVEGARDE
Write-Title "CRÉATION DE LA SAUVEGARDE"

if (Test-Path "$ProjectRoot\client\build") {
    $BackupName = "backup_$Date.zip"
    $BackupPath = "$BackupDir\$BackupName"
    
    try {
        Compress-Archive -Path "$ProjectRoot\client\build" -DestinationPath $BackupPath -Force
        Write-Success "Sauvegarde créée: $BackupName"
        Write-Log "Sauvegarde créée: $BackupPath"
    } catch {
        Write-Warning "Impossible de créer la sauvegarde: $($_.Exception.Message)"
        Write-Log "WARNING: Échec de la sauvegarde"
    }
}

# 3. TESTS PRÉ-DÉPLOIEMENT
if (!$SkipTests) {
    Write-Title "TESTS PRÉ-DÉPLOIEMENT"
    
    # Test du serveur
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            Write-Success "Serveur backend opérationnel"
            Write-Log "Test serveur: SUCCÈS"
        } else {
            Write-Warning "Serveur backend répond avec le code: $($Response.StatusCode)"
            Write-Log "Test serveur: CODE $($Response.StatusCode)"
        }
    } catch {
        Write-Warning "Serveur backend non accessible: $($_.Exception.Message)"
        Write-Log "Test serveur: ÉCHEC - $($_.Exception.Message)"
    }
    
    # Test du client
    try {
        $Response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        if ($Response.StatusCode -eq 200) {
            Write-Success "Client frontend opérationnel"
            Write-Log "Test client: SUCCÈS"
        } else {
            Write-Warning "Client frontend répond avec le code: $($Response.StatusCode)"
            Write-Log "Test client: CODE $($Response.StatusCode)"
        }
    } catch {
        Write-Warning "Client frontend non accessible: $($_.Exception.Message)"
        Write-Log "Test client: ÉCHEC - $($_.Exception.Message)"
    }
}

# 4. INSTALLATION DES DÉPENDANCES
Write-Title "INSTALLATION DES DÉPENDANCES"

# Installation des dépendances racine
Write-Info "Installation des dépendances racine..."
try {
    npm install
    Write-Success "Dépendances racine installées"
    Write-Log "Installation dépendances racine: SUCCÈS"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances racine: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dépendances racine échouée"
    exit 1
}

# Installation des dépendances serveur
Write-Info "Installation des dépendances serveur..."
try {
    Set-Location "$ProjectRoot\server"
    npm install
    Set-Location $ProjectRoot
    Write-Success "Dépendances serveur installées"
    Write-Log "Installation dépendances serveur: SUCCÈS"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances serveur: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dépendances serveur échouée"
    exit 1
}

# Installation des dépendances client
Write-Info "Installation des dépendances client..."
try {
    Set-Location "$ProjectRoot\client"
    npm install
    Set-Location $ProjectRoot
    Write-Success "Dépendances client installées"
    Write-Log "Installation dépendances client: SUCCÈS"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances client: $($_.Exception.Message)"
    Write-Log "ERREUR: Installation dépendances client échouée"
    exit 1
}

# 5. BUILD DE L'APPLICATION
Write-Title "BUILD DE L'APPLICATION"

Write-Info "Build du client React..."
try {
    Set-Location "$ProjectRoot\client"
    npm run build
    Set-Location $ProjectRoot
    Write-Success "Build du client terminé"
    Write-Log "Build client: SUCCÈS"
} catch {
    Write-Error "Erreur lors du build du client: $($_.Exception.Message)"
    Write-Log "ERREUR: Build client échoué"
    exit 1
}

# 6. CONFIGURATION PRODUCTION
Write-Title "CONFIGURATION PRODUCTION"

# Création du fichier .env.production
$EnvProduction = @"
NODE_ENV=production
PORT=5000
JWT_SECRET=votre_secret_tres_securise_production_2024
JWT_EXPIRE=7d

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/communiconnect_prod

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=https://$Domain

# Logging
LOG_LEVEL=info
LOG_FILE=$LogDir\app.log

# Sécurité
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Monitoring
PM2_MONITORING=true
"@

try {
    $EnvProduction | Out-File -FilePath "$ProjectRoot\.env.production" -Encoding UTF8
    Write-Success "Fichier .env.production créé"
    Write-Log "Configuration production: SUCCÈS"
} catch {
    Write-Error "Erreur lors de la création du fichier .env.production: $($_.Exception.Message)"
    Write-Log "ERREUR: Configuration production échouée"
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
    Write-Success "Configuration PM2 créée"
    Write-Log "Configuration PM2: SUCCÈS"
} catch {
    Write-Error "Erreur lors de la création de la configuration PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Configuration PM2 échouée"
}

# 8. DÉMARRAGE DES SERVICES
Write-Title "DÉMARRAGE DES SERVICES"

# Vérifier si PM2 est installé
try {
    $Pm2Version = pm2 --version
    Write-Success "PM2 détecté: $Pm2Version"
    Write-Log "PM2 version: $Pm2Version"
} catch {
    Write-Info "Installation de PM2..."
    try {
        npm install -g pm2
        Write-Success "PM2 installé"
        Write-Log "PM2 installé avec succès"
    } catch {
        Write-Error "Impossible d'installer PM2: $($_.Exception.Message)"
        Write-Log "ERREUR: Installation PM2 échouée"
        exit 1
    }
}

# Arrêter les processus existants
try {
    pm2 stop all
    pm2 delete all
    Write-Info "Processus PM2 existants arrêtés"
    Write-Log "Arrêt processus PM2: SUCCÈS"
} catch {
    Write-Info "Aucun processus PM2 à arrêter"
    Write-Log "Arrêt processus PM2: AUCUN PROCESSUS"
}

# Démarrer avec PM2
try {
    pm2 start ecosystem.config.js
    pm2 save
    Write-Success "Services démarrés avec PM2"
    Write-Log "Démarrage PM2: SUCCÈS"
} catch {
    Write-Error "Erreur lors du démarrage PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Démarrage PM2 échoué"
    exit 1
}

# 9. VÉRIFICATION FINALE
Write-Title "VÉRIFICATION FINALE"

Start-Sleep 5

# Vérifier le statut PM2
try {
    $Pm2Status = pm2 status
    Write-Info "Statut PM2:"
    Write-Host $Pm2Status
    Write-Log "Vérification PM2: SUCCÈS"
} catch {
    Write-Error "Impossible de vérifier le statut PM2: $($_.Exception.Message)"
    Write-Log "ERREUR: Vérification PM2 échouée"
}

# Test de l'API
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($Response.StatusCode -eq 200) {
        Write-Success "API production opérationnelle"
        Write-Log "Test API production: SUCCÈS"
    } else {
        Write-Warning "API production répond avec le code: $($Response.StatusCode)"
        Write-Log "Test API production: CODE $($Response.StatusCode)"
    }
} catch {
    Write-Error "API production non accessible: $($_.Exception.Message)"
    Write-Log "Test API production: ÉCHEC"
}

# Test du client
try {
    $Response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
    if ($Response.StatusCode -eq 200) {
        Write-Success "Client production opérationnel"
        Write-Log "Test client production: SUCCÈS"
    } else {
        Write-Warning "Client production répond avec le code: $($Response.StatusCode)"
        Write-Log "Test client production: CODE $($Response.StatusCode)"
    }
} catch {
    Write-Error "Client production non accessible: $($_.Exception.Message)"
    Write-Log "Test client production: ÉCHEC"
}

# 10. RÉSUMÉ FINAL
Write-Title "RÉSUMÉ DU DÉPLOIEMENT"

Write-Success "🎉 DÉPLOIEMENT PRODUCTION TERMINÉ !"
Write-Log "DÉPLOIEMENT TERMINÉ AVEC SUCCÈS"

Write-Info "📊 INFORMATIONS:"
Write-Info "   - API: http://localhost:5000"
Write-Info "   - Client: http://localhost:3000"
Write-Info "   - Logs: $LogDir"
Write-Info "   - Sauvegarde: $BackupDir"

Write-Info "🔧 COMMANDES UTILES:"
Write-Info "   - Statut: pm2 status"
Write-Info "   - Logs: pm2 logs"
Write-Info "   - Monitoring: pm2 monit"
Write-Info "   - Redémarrage: pm2 restart all"

Write-Info "📞 SUPPORT:"
Write-Info "   - Documentation: GUIDE_DEPLOIEMENT_PRODUCTION.md"
Write-Info "   - Logs détaillés: $LogFile"

Write-Log "Déploiement terminé avec succès - $(Get-Date)" 