#!/bin/bash

echo "🚀 DÉPLOIEMENT AUTOMATIQUE - COMMUNICONNECT"
echo "============================================"

# Variables
SERVER_IP=""
DOMAIN=""
BRANCH="main"

# Demander les informations
read -p "Entrez l'IP du serveur: " SERVER_IP
read -p "Entrez le nom de domaine: " DOMAIN
read -p "Entrez la branche à déployer (main): " BRANCH

echo ""
echo "📋 Configuration de déploiement:"
echo "   Serveur: $SERVER_IP"
echo "   Domaine: $DOMAIN"
echo "   Branche: $BRANCH"
echo ""

# Vérifier la connexion SSH
echo "🔌 Test de connexion SSH..."
if ! ssh -o ConnectTimeout=10 communiconnect@$SERVER_IP "echo 'Connexion SSH OK'"; then
    echo "❌ Impossible de se connecter au serveur"
    exit 1
fi

# Build de l'application
echo "🔨 Build de l'application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build"
    exit 1
fi

# Synchronisation avec le serveur
echo "📤 Synchronisation avec le serveur..."
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    --exclude 'logs' \
    ./ communiconnect@$SERVER_IP:/var/www/communiconnect/

# Configuration des variables d'environnement
echo "⚙️ Configuration des variables d'environnement..."
ssh communiconnect@$SERVER_IP "cd /var/www/communiconnect && cat > .env.production << 'EOF'
NODE_ENV=production
PORT=5000
JWT_SECRET=communiconnect-production-secret-2024
MONGODB_URI=mongodb+srv://communiconnect-user:CommuniConnect2024!@communiconnect-cluster.xxxxx.mongodb.net/communiconnect
REDIS_URL=redis://localhost:6379
CORS_ORIGIN=https://$DOMAIN
EOF"

# Installation des dépendances sur le serveur
echo "📦 Installation des dépendances..."
ssh communiconnect@$SERVER_IP "cd /var/www/communiconnect && npm install --production"

# Build de l'application sur le serveur
echo "🔨 Build de l'application sur le serveur..."
ssh communiconnect@$SERVER_IP "cd /var/www/communiconnect && npm run build"

# Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
ssh communiconnect@$SERVER_IP "cd /var/www/communiconnect && pm2 reload ecosystem.config.js --env production"

# Vérification du statut
echo "✅ Vérification du statut..."
ssh communiconnect@$SERVER_IP "pm2 status"

# Test de l'application
echo "🧪 Test de l'application..."
sleep 10
curl -I https://$DOMAIN

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Déploiement réussi !"
    echo ""
    echo "🔗 Votre application est accessible sur:"
    echo "   https://$DOMAIN"
    echo ""
    echo "📊 Monitoring:"
    echo "   - PM2: ssh communiconnect@$SERVER_IP 'pm2 monit'"
    echo "   - Logs: ssh communiconnect@$SERVER_IP 'pm2 logs'"
    echo "   - Netdata: http://$SERVER_IP:19999"
else
    echo "❌ Erreur lors du test de l'application"
    exit 1
fi 