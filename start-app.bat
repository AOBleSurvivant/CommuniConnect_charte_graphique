@echo off
echo 🚀 Démarrage de CommuniConnect...
echo.

echo 📋 Vérification des processus existants...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Processus Node.js arrêtés

echo.
echo 🔧 Démarrage du serveur backend...
cd server
start "Backend Server" cmd /k "node index.js"
timeout /t 3 /nobreak >nul

echo.
echo 🌐 Démarrage du frontend...
cd ..\client
start "Frontend React" cmd /k "npm start"
timeout /t 3 /nobreak >nul

echo.
echo ✅ Application démarrée !
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo.
echo 🎯 Testez l'application dans votre navigateur
echo.
pause 