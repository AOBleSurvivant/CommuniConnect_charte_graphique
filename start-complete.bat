@echo off
echo 🚀 Démarrage complet de CommuniConnect...
echo.

echo 📁 Vérification des dépendances...
cd server
npm install
cd ..

cd client
npm install
cd ..

echo.
echo 🌐 Démarrage du serveur en arrière-plan...
start "Serveur CommuniConnect" cmd /c "cd server && node index.js"

echo ⏳ Attente du démarrage du serveur...
timeout /t 5 /nobreak > nul

echo.
echo 📊 Création des données de test...
node create-test-data.js

echo.
echo 🎉 Installation terminée!
echo 📱 Accédez à l'application: http://localhost:3000
echo 🔧 API disponible: http://localhost:5000/api
echo.
echo 💡 Pour démarrer le client, ouvrez un nouveau terminal et exécutez:
echo    cd client && npm start
echo.
pause