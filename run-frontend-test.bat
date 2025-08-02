@echo off
echo ========================================
echo Test Frontend CommuniConnect
echo ========================================
echo.

echo [1/4] Verification de Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js n'est pas installe. Veuillez installer Node.js.
    pause
    exit /b 1
)
echo ✅ Node.js detecte

echo.
echo [2/4] Installation des dependances...
npm install puppeteer
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances
    pause
    exit /b 1
)
echo ✅ Dependances installees

echo.
echo [3/4] Verification du serveur frontend...
echo Veuillez vous assurer que le serveur frontend est demarre:
echo   cd client
echo   npm start
echo.
echo Le serveur doit etre accessible sur http://localhost:3000
echo.
set /p confirm="Le serveur frontend est-il demarre? (o/n): "
if /i "%confirm%" neq "o" (
    echo ❌ Veuillez demarrer le serveur frontend avant de continuer
    pause
    exit /b 1
)

echo.
echo [4/4] Lancement des tests frontend...
node test-frontend-complet.js

echo.
echo ========================================
echo Test termine!
echo ========================================
echo.
echo 📄 Rapport: frontend-test-report.json
echo 📸 Screenshots: dossier screenshots/
echo.
pause 