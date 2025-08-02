@echo off
echo.
echo 🎯 DÉMARRAGE TEST FONCTIONNALITÉ "MES AMIS"
echo =============================================
echo.

echo 🔧 Vérification de l'environnement...
echo.

echo 📁 Vérification des fichiers essentiels...
if exist "client\src\pages\Friends\FriendsPage.js" (
    echo    ✅ FriendsPage.js présent
) else (
    echo    ❌ FriendsPage.js manquant
)

if exist "client\src\components\common\LazyLoader.js" (
    echo    ✅ LazyLoader.js présent
) else (
    echo    ❌ LazyLoader.js manquant
)

if exist "client\src\App.js" (
    echo    ✅ App.js présent
) else (
    echo    ❌ App.js manquant
)

if exist "server\routes\friends.js" (
    echo    ✅ Route friends.js présente
) else (
    echo    ❌ Route friends.js manquante
)

echo.
echo 🧪 Exécution des tests de vérification...
node test-final-amis-strict.js

echo.
echo 🚀 Démarrage du serveur...
echo.
cd server
start "Serveur" cmd /k "npm start"

echo.
echo ⏳ Attente du démarrage du serveur...
timeout /t 5 /nobreak >nul

echo.
echo 🌐 Démarrage du client...
echo.
cd ..\client
start "Client" cmd /k "npm start"

echo.
echo ⏳ Attente du démarrage du client...
timeout /t 10 /nobreak >nul

echo.
echo 🎯 TESTS PRÊTS
echo ===============
echo.
echo 💡 Instructions de test:
echo 1. Ouvrez votre navigateur
echo 2. Allez sur http://localhost:3000
echo 3. Connectez-vous si nécessaire
echo 4. Naviguez vers /friends
echo 5. Vérifiez que la page se charge correctement
echo 6. Testez les fonctionnalités d'amis
echo.
echo 🔍 Vérifications à faire:
echo - La page se charge sans erreur
echo - Pas d'erreurs dans la console du navigateur
echo - Les composants s'affichent correctement
echo - Les interactions fonctionnent
echo.
echo ⚠️  Si des problèmes surviennent:
echo - Vérifiez la console du navigateur (F12)
echo - Redémarrez le client: cd client && npm start
echo - Videz le cache: Ctrl+F5
echo.
echo 🎯 Test terminé!
echo.
pause 