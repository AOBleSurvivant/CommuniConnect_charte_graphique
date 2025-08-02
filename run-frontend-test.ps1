Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Frontend CommuniConnect" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js détecté: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez installer Node.js." -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host ""
Write-Host "[2/4] Installation des dépendances..." -ForegroundColor Yellow
try {
    npm install puppeteer
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

Write-Host ""
Write-Host "[3/4] Démarrage du serveur frontend..." -ForegroundColor Yellow
Write-Host "Démarrage du serveur React..." -ForegroundColor Cyan

# Démarrer le serveur frontend en arrière-plan
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "start" -WorkingDirectory "client" -WindowStyle Hidden -PassThru

Write-Host "Attente du démarrage du serveur..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "[4/4] Lancement des tests frontend..." -ForegroundColor Yellow

# Test de connectivité
$maxAttempts = 10
$attempt = 0
$serverReady = $false

while ($attempt -lt $maxAttempts -and -not $serverReady) {
    $attempt++
    Write-Host "Tentative $attempt/$maxAttempts de connexion au serveur..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $serverReady = $true
            Write-Host "✅ Serveur frontend accessible!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⏳ Serveur pas encore prêt, attente..." -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
}

if (-not $serverReady) {
    Write-Host "❌ Le serveur frontend n'est pas accessible après $maxAttempts tentatives" -ForegroundColor Red
    Write-Host "Vérifiez que le serveur démarre correctement" -ForegroundColor Yellow
    Read-Host "Appuyez sur Entrée pour continuer"
    exit 1
}

# Exécuter les tests
try {
    node test-frontend-simple.js
} catch {
    Write-Host "❌ Erreur lors de l'exécution des tests: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test terminé!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📄 Rapport: frontend-simple-test-report.json" -ForegroundColor Green
Write-Host ""

# Arrêter le serveur
Write-Host "Arrêt du serveur frontend..." -ForegroundColor Yellow
if ($serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force
    Write-Host "✅ Serveur arrêté" -ForegroundColor Green
}

Read-Host "Appuyez sur Entrée pour continuer" 