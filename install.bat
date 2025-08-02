@echo off
echo ========================================
echo Installation de CommuniConnect
echo ========================================
echo.

echo Installation des dependances principales...
npm install

echo.
echo Installation des dependances du serveur...
cd server
npm install
cd ..

echo.
echo Installation des dependances du client...
cd client
npm install
cd ..

echo.
echo ========================================
echo Installation terminee !
echo ========================================
echo.
echo Pour demarrer l'application :
echo 1. Copiez server/env.example vers server/.env
echo 2. Configurez vos variables d'environnement
echo 3. Demarrez MongoDB
echo 4. Lancez : npm run dev
echo.
pause 