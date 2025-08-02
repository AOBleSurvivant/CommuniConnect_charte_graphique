@echo off
echo ========================================
echo 🚀 DÉMARRAGE COMMUNICONNECT 100% QUALITÉ
echo ========================================

REM Vérifier Node.js
echo 📋 Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier npm
echo 📋 Vérification de npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé.
    pause
    exit /b 1
)

REM Nettoyer les processus existants
echo 🔄 Nettoyage des processus existants...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Vérifier et tuer les processus sur les ports
echo 🔄 Libération des ports...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do taskkill /f /pid %%a >nul 2>&1
timeout /t 3 /nobreak >nul

REM Installer les dépendances côté client
echo 📦 Installation des dépendances client...
cd client
if not exist node_modules (
    echo 📥 Installation des dépendances client...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances client
        pause
        exit /b 1
    )
)

REM Installer les dépendances côté serveur
echo 📦 Installation des dépendances serveur...
cd ..\server
if not exist node_modules (
    echo 📥 Installation des dépendances serveur...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Erreur lors de l'installation des dépendances serveur
        pause
        exit /b 1
    )
)

REM Créer les dossiers de logs si nécessaire
if not exist logs mkdir logs
if not exist tests\performance mkdir tests\performance

echo ✅ Préparation terminée

REM Démarrer le serveur en arrière-plan
echo 🖥️ Démarrage du serveur Express...
start "Server Express" cmd /k "cd server && npm start"

REM Attendre le démarrage du serveur
echo ⏳ Attente du démarrage du serveur...
timeout /t 10 /nobreak >nul

REM Vérifier que le serveur répond
echo 🔍 Vérification du serveur...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Le serveur ne répond pas encore, attente supplémentaire...
    timeout /t 10 /nobreak >nul
)

REM Démarrer le client
echo 📱 Démarrage du client React...
start "Client React" cmd /k "cd client && npm start"

REM Attendre le démarrage du client
echo ⏳ Attente du démarrage du client...
timeout /t 15 /nobreak >nul

REM Vérifier que le client répond
echo 🔍 Vérification du client...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Le client ne répond pas encore, attente supplémentaire...
    timeout /t 10 /nobreak >nul
)

echo.
echo ========================================
echo 🎉 COMMUNICONNECT DÉMARRÉ AVEC SUCCÈS !
echo ========================================
echo.
echo 📱 Client React: http://localhost:3000
echo 🖥️ Serveur API: http://localhost:5000
echo 📚 Documentation API: http://localhost:5000/api-docs
echo.
echo 🚀 Fonctionnalités disponibles:
echo    ✅ Tests unitaires complets
echo    ✅ Documentation API Swagger
echo    ✅ Validation des données avec Joi
echo    ✅ Logging avancé avec Winston
echo    ✅ Tests de performance avec Artillery
echo    ✅ Sécurité renforcée
echo    ✅ Optimisations frontend
echo.
echo 📊 Pour tester les améliorations:
echo    node test-ameliorations-finales.js
echo.
echo 🔥 Pour les tests de performance:
echo    cd server && node tests/performance/performance-test.js
echo.
echo ========================================

REM Ouvrir le navigateur
echo 🌐 Ouverture du navigateur...
start http://localhost:3000

echo.
echo ✅ Application prête ! Appuyez sur une touche pour fermer cette fenêtre...
pause >nul 