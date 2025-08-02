@echo off
echo ========================================
echo Démarrage Frontend CommuniConnect
echo ========================================
echo.

echo [1/3] Vérification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installé
    pause
    exit /b 1
)
echo ✅ Node.js détecté

echo.
echo [2/3] Installation des dépendances...
cd client
npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation
    pause
    exit /b 1
)
echo ✅ Dépendances installées

echo.
echo [3/3] Démarrage du serveur frontend...
echo Le serveur sera accessible sur http://localhost:3001
echo.
npm start

pause 