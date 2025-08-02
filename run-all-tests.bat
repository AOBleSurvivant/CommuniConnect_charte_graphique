@echo off
echo 🧪 ========================================
echo 🧪 SUITE DE TESTS COMPLÈTE COMMUNICONNECT
echo 🧪 ========================================
echo.

echo 📋 Vérification des prérequis...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo 📥 Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js détecté

REM Vérifier si npm est disponible
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas disponible
    pause
    exit /b 1
)
echo ✅ npm détecté

echo.
echo 🚀 Démarrage du serveur backend...
echo.

REM Démarrer le serveur en arrière-plan
start "Serveur CommuniConnect" cmd /k "cd server && npm install && node index.js"

echo ⏳ Attente du démarrage du serveur...
timeout /t 10 /nobreak >nul

echo.
echo 📊 Test de connectivité du serveur...
node test-routes-quick.js

echo.
echo 🗃️ Création des données de test...
node create-test-data.js

echo.
echo 🧪 Exécution des tests complets...
node test-routes-complete.js

echo.
echo 🌐 Démarrage du client frontend...
echo 📝 Le client sera accessible sur http://localhost:3000
echo.

REM Démarrer le client en arrière-plan
start "Client CommuniConnect" cmd /k "cd client && npm install && npm start"

echo.
echo ✅ Tests terminés !
echo 📊 Consultez les rapports de test ci-dessus
echo 🌐 Application accessible sur http://localhost:3000
echo 🔧 Serveur API accessible sur http://localhost:5000
echo.

pause