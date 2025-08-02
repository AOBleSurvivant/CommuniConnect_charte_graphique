@echo off
echo ========================================
echo 🚀 DÉMARRAGE ROBUSTE DE COMMUNICONNECT
echo ========================================

echo.
echo 📋 Vérification de l'environnement...

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé ou n'est pas dans le PATH
    echo 💡 Installez Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js détecté

REM Vérifier si npm est installé
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm n'est pas installé
    pause
    exit /b 1
)
echo ✅ npm détecté

echo.
echo 🔍 Vérification des dépendances...

REM Vérifier si les node_modules existent dans le client
if not exist "client\node_modules" (
    echo ⚠️ node_modules manquant dans le client
    echo 📦 Installation des dépendances client...
    cd client
    npm install
    cd ..
) else (
    echo ✅ Dépendances client présentes
)

REM Vérifier si les node_modules existent dans le server
if not exist "server\node_modules" (
    echo ⚠️ node_modules manquant dans le server
    echo 📦 Installation des dépendances server...
    cd server
    npm install
    cd ..
) else (
    echo ✅ Dépendances server présentes
)

echo.
echo 🌐 Vérification du port 3000...

REM Vérifier si le port 3000 est déjà utilisé
netstat -an | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️ Le port 3000 est déjà utilisé
    echo 🔄 Arrêt des processus sur le port 3000...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 3 /nobreak >nul
) else (
    echo ✅ Port 3000 disponible
)

echo.
echo 🚀 Démarrage de l'application...

REM Démarrer le client en arrière-plan
echo 📱 Démarrage du client React...
start "Client React" cmd /k "cd client && npm start"

REM Attendre que le client démarre
echo ⏳ Attente du démarrage du client...
timeout /t 10 /nobreak >nul

REM Démarrer le server en arrière-plan
echo 🖥️ Démarrage du serveur Express...
start "Server Express" cmd /k "cd server && npm start"

echo.
echo ⏳ Attente du démarrage complet...
timeout /t 15 /nobreak >nul

echo.
echo 🔍 Vérification de l'accessibilité...

REM Tester l'accessibilité de l'application
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application accessible sur http://localhost:3000
) else (
    echo ⚠️ Application pas encore accessible, attente supplémentaire...
    timeout /t 10 /nobreak >nul
    curl -s http://localhost:3000 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Application maintenant accessible
    ) else (
        echo ❌ Application non accessible
        echo 💡 Vérifiez les logs dans les fenêtres ouvertes
    )
)

echo.
echo ========================================
echo 🎉 DÉMARRAGE TERMINÉ
echo ========================================
echo.
echo 📱 Client React: http://localhost:3000
echo 🖥️ Server Express: http://localhost:5000
echo.
echo 💡 Pour arrêter l'application:
echo    1. Fermez les fenêtres de terminal ouvertes
echo    2. Ou utilisez Ctrl+C dans chaque fenêtre
echo.
echo 🔍 Pour tester l'application:
echo    node test-events-simple.js
echo.
pause 