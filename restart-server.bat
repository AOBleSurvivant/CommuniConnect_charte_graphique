@echo off
echo 🔄 Redémarrage du serveur CommuniConnect...
echo.

echo 📋 Étape 1: Arrêt des processus existants...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo 📋 Étape 2: Vérification des ports...
netstat -ano | findstr :5000
if %errorlevel% equ 0 (
    echo ⚠️  Port 5000 encore occupé, tentative de libération...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /f /pid %%a 2>nul
    )
    timeout /t 2 /nobreak >nul
)

echo 📋 Étape 3: Démarrage du serveur...
cd server
start "CommuniConnect Server" cmd /k "npm start"

echo 📋 Étape 4: Attente du démarrage...
timeout /t 5 /nobreak >nul

echo 📋 Étape 5: Test de la documentation Swagger...
curl -s http://localhost:5000/api-docs >nul
if %errorlevel% equ 0 (
    echo ✅ Documentation Swagger accessible
) else (
    echo ❌ Documentation Swagger non accessible
)

echo.
echo 🎯 Serveur redémarré avec les nouvelles dépendances Swagger
echo 📚 Documentation disponible sur: http://localhost:5000/api-docs 