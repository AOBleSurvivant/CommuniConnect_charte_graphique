@echo off
echo ========================================
echo Démarrage Frontend sur Port 3000
echo ========================================
echo.

cd client

echo Forcing port 3000...
set PORT=3000
set BROWSER=none

echo Starting React app on port 3000...
npm start

pause 