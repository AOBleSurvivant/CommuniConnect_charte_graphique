@echo off
echo ========================================
echo  DEMARRAGE ET TEST COMMUNICONNECT
echo ========================================

echo.
echo 1. Demarrage du serveur backend...
cd server
start "Serveur Backend" cmd /k "npm start"
timeout /t 5 /nobreak >nul

echo.
echo 2. Demarrage du client frontend...
cd ../client
start "Client Frontend" cmd /k "npm start"
timeout /t 10 /nobreak >nul

echo.
echo 3. Retour au dossier principal...
cd ..

echo.
echo 4. Test du systeme d'evenements...
node solution-definitive-evenements.js

echo.
echo ========================================
echo  TEST TERMINE
echo ========================================
pause 