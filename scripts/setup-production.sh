#!/bin/bash

echo "🚀 CONFIGURATION DU SERVEUR DE PRODUCTION - COMMUNICONNECT"
echo "=========================================================="

# Variables
SERVER_IP=""
DOMAIN=""
EMAIL=""

# Demander les informations
read -p "Entrez l'IP du serveur: " SERVER_IP
read -p "Entrez le nom de domaine (ex: communiconnect.gn): " DOMAIN
read -p "Entrez votre email (pour SSL): " EMAIL

echo ""
echo "📋 Configuration détectée:"
echo "   Serveur: $SERVER_IP"
echo "   Domaine: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Mise à jour du système
echo "🔄 Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
echo "📦 Installation des dépendances..."
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Installation de Node.js
echo "🟢 Installation de Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de PM2
echo "⚡ Installation de PM2..."
sudo npm install -g pm2

# Installation de MongoDB
echo "🍃 Installation de MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Installation de Redis
echo "🔴 Installation de Redis..."
sudo apt install -y redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configuration de Nginx
echo "🌐 Configuration de Nginx..."
sudo tee /etc/nginx/sites-available/communiconnect << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Redirection vers HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss;

    # Reverse proxy pour l'API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 86400;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Serveur de fichiers statiques
    location /static {
        alias /var/www/communiconnect/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Application React
    location / {
        root /var/www/communiconnect/client/build;
        try_files \$uri \$uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Logs
    access_log /var/log/nginx/communiconnect.access.log;
    error_log /var/log/nginx/communiconnect.error.log;
}
EOF

# Activer le site
sudo ln -sf /etc/nginx/sites-available/communiconnect /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Configuration du firewall
echo "🔥 Configuration du firewall..."
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Création de l'utilisateur pour l'application
echo "👤 Création de l'utilisateur communiconnect..."
sudo useradd -m -s /bin/bash communiconnect
sudo usermod -aG sudo communiconnect

# Configuration des logs
echo "📝 Configuration des logs..."
sudo tee /etc/logrotate.d/communiconnect << EOF
/var/log/communiconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 communiconnect communiconnect
    postrotate
        systemctl reload nginx
    endscript
}
EOF

echo ""
echo "✅ Configuration du serveur terminée !"
echo ""
echo "📋 Prochaines étapes:"
echo "1. Déployer le code sur le serveur"
echo "2. Configurer les variables d'environnement"
echo "3. Obtenir le certificat SSL"
echo "4. Démarrer l'application avec PM2"
echo ""
echo "🔗 Commandes utiles:"
echo "   sudo certbot --nginx -d $DOMAIN"
echo "   sudo pm2 start ecosystem.config.js"
echo "   sudo pm2 save"
echo "   sudo pm2 startup" 