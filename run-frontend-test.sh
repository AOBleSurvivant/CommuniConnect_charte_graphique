#!/bin/bash

echo "========================================"
echo "Test Frontend CommuniConnect"
echo "========================================"
echo

echo "[1/4] Vérification de Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js."
    exit 1
fi
echo "✅ Node.js détecté"

echo
echo "[2/4] Installation des dépendances..."
npm install puppeteer
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation des dépendances"
    exit 1
fi
echo "✅ Dépendances installées"

echo
echo "[3/4] Vérification du serveur frontend..."
echo "Veuillez vous assurer que le serveur frontend est démarré:"
echo "  cd client"
echo "  npm start"
echo
echo "Le serveur doit être accessible sur http://localhost:3000"
echo

read -p "Le serveur frontend est-il démarré? (o/n): " confirm
if [[ $confirm != "o" && $confirm != "O" ]]; then
    echo "❌ Veuillez démarrer le serveur frontend avant de continuer"
    exit 1
fi

echo
echo "[4/4] Lancement des tests frontend..."
node test-frontend-complet.js

echo
echo "========================================"
echo "Test terminé!"
echo "========================================"
echo
echo "📄 Rapport: frontend-test-report.json"
echo "📸 Screenshots: dossier screenshots/"
echo 