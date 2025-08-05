#!/bin/bash

echo "🚀 Déploiement CommuniConnect sur Vercel"
echo "=========================================="

# Vérification des prérequis
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé. Installation..."
    npm install -g vercel
fi

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm run install-all

# Build du client
echo "🔨 Build du client React..."
cd client && npm run build && cd ..

# Vérification du build
if [ ! -d "client/build" ]; then
    echo "❌ Erreur: Le build n'a pas été créé"
    exit 1
fi

echo "✅ Build réussi!"

# Déploiement sur Vercel
echo "🌐 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé!"
echo "🌍 Votre application est maintenant en ligne!" 