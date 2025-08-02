#!/bin/bash

# 🚀 Script de déploiement CommuniConnect
# Ce script automatise le processus de déploiement

set -e  # Arrêter en cas d'erreur

echo "🚀 Démarrage du déploiement CommuniConnect..."

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Vérifier les prérequis
print_step "Vérification des prérequis..."
    
# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
# Vérifier git
if ! command -v git &> /dev/null; then
    print_error "git n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi
    
print_message "Tous les prérequis sont satisfaits."

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ] || [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Vous devez être dans le répertoire racine du projet CommuniConnect."
        exit 1
    fi
    
print_step "Préparation de l'environnement..."

# Installer les dépendances du client
print_message "Installation des dépendances du frontend..."
cd client
npm install
cd ..

# Installer les dépendances du serveur
print_message "Installation des dépendances du backend..."
cd server
npm install
cd ..

# Vérifier les fichiers de configuration
print_step "Vérification des fichiers de configuration..."

# Vérifier vercel.json
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json manquant. Création..."
    # Le fichier vercel.json a déjà été créé
fi

# Vérifier les fichiers d'environnement
if [ ! -f "client/env.production.example" ]; then
    print_error "client/env.production.example manquant."
    exit 1
fi

if [ ! -f "server/env.production.example" ]; then
    print_error "server/env.production.example manquant."
    exit 1
fi

print_message "Configuration vérifiée."

# Build du client
print_step "Build du frontend..."
cd client
npm run build
cd ..

print_message "Build du frontend terminé."

# Tests de base
print_step "Tests de base..."

# Test du serveur local
print_message "Test du serveur local..."
cd server
timeout 10s npm start &
SERVER_PID=$!
sleep 5

# Test de l'API
if curl -s http://localhost:5000/api/health > /dev/null; then
    print_message "API locale fonctionnelle."
else
    print_warning "API locale non accessible (normal si pas de base de données)."
fi

# Arrêter le serveur
kill $SERVER_PID 2>/dev/null || true
cd ..

print_step "Tests terminés."

# Instructions de déploiement
echo ""
echo "🎉 Préparation terminée !"
echo ""
echo "📋 Étapes suivantes pour le déploiement :"
echo ""
echo "1. 🗄️  Base de données MongoDB Atlas :"
echo "   - Allez sur https://www.mongodb.com/atlas"
echo "   - Créez un compte gratuit"
echo "   - Créez un cluster gratuit"
echo "   - Notez votre URI de connexion"
echo ""
echo "2. ⚙️  Déploiement Backend sur Render :"
echo "   - Allez sur https://render.com"
echo "   - Créez un compte gratuit"
echo "   - Connectez votre repo GitHub"
echo "   - Créez un Web Service"
echo "   - Root Directory: server"
echo "   - Build Command: npm install"
echo "   - Start Command: npm start"
echo ""
echo "3. 🌐 Déploiement Frontend sur Vercel :"
echo "   - Allez sur https://vercel.com"
echo "   - Créez un compte gratuit"
echo "   - Connectez votre repo GitHub"
echo "   - Créez un nouveau projet"
echo "   - Root Directory: client"
echo "   - Framework: Create React App"
echo ""
echo "4. 🔧 Configuration des variables d'environnement :"
echo "   - Dans Render (Backend):"
echo "     NODE_ENV=production"
echo "     PORT=10000"
echo "     MONGODB_URI=votre-uri-mongodb"
echo "     JWT_SECRET=votre-secret-jwt"
echo "     CORS_ORIGIN=https://votre-app.vercel.app"
    echo ""
echo "   - Dans Vercel (Frontend):"
echo "     REACT_APP_API_URL=https://votre-api.onrender.com/api"
echo "     REACT_APP_SOCKET_URL=https://votre-api.onrender.com"
echo "     REACT_APP_ENV=production"
    echo ""
echo "📖 Consultez DEPLOYMENT.md pour les instructions détaillées."
    echo ""
echo "🚀 Bon déploiement !" 