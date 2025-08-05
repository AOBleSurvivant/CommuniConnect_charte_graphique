# 🚀 GUIDE DÉPLOIEMENT PRODUCTION - COMMUNICONNECT

## 📋 **PRÉREQUIS**

### **1. Serveur de Production**
- ✅ **OS** : Ubuntu 20.04+ ou CentOS 8+
- ✅ **RAM** : 4GB minimum (8GB recommandé)
- ✅ **CPU** : 2 cœurs minimum (4 cœurs recommandé)
- ✅ **Stockage** : 50GB minimum
- ✅ **Réseau** : Connexion internet stable

### **2. Domaines et SSL**
- ✅ **Domaine principal** : `communiconnect.gn`
- ✅ **Sous-domaines** : `api.communiconnect.gn`, `admin.communiconnect.gn`
- ✅ **Certificats SSL** : Let's Encrypt (gratuit)

### **3. Services Externes**
- ✅ **Base de données** : MongoDB Atlas (cloud) ou MongoDB local
- ✅ **Cache** : Redis (optionnel)
- ✅ **Stockage** : AWS S3 ou local
- ✅ **Monitoring** : PM2 + Winston

---

## 🛠️ **INSTALLATION SERVEUR**

### **1. Configuration Système**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx

# Installation de Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de PM2
sudo npm install -g pm2

# Installation de MongoDB (si local)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **2. Configuration Firewall**
```bash
# Configuration UFW
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5000
sudo ufw enable
```

### **3. Configuration Nginx**
```bash
# Création du fichier de configuration
sudo nano /etc/nginx/sites-available/communiconnect

# Configuration pour le frontend
server {
    listen 80;
    server_name communiconnect.gn www.communiconnect.gn;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Configuration pour l'API
server {
    listen 80;
    server_name api.communiconnect.gn;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activation du site
sudo ln -s /etc/nginx/sites-available/communiconnect /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔧 **CONFIGURATION APPLICATION**

### **1. Variables d'Environnement Production**
```bash
# Création du fichier .env.production
sudo nano /var/www/communiconnect/.env.production

# Configuration production
NODE_ENV=production
PORT=5000
JWT_SECRET=votre_secret_tres_securise_production_2024
JWT_EXPIRE=7d

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/communiconnect_prod
# Ou MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communiconnect_prod

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# CORS
CORS_ORIGIN=https://communiconnect.gn

# Logging
LOG_LEVEL=info
LOG_FILE=/var/log/communiconnect/app.log

# Sécurité
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100

# Monitoring
PM2_MONITORING=true
```

### **2. Configuration PM2**
```bash
# Création du fichier ecosystem.config.js
sudo nano /var/www/communiconnect/ecosystem.config.js

module.exports = {
  apps: [{
    name: 'communiconnect-api',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/communiconnect/err.log',
    out_file: '/var/log/communiconnect/out.log',
    log_file: '/var/log/communiconnect/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }, {
    name: 'communiconnect-client',
    script: 'node_modules/serve/serve.js',
    args: '-s build -l 3000',
    env: {
      NODE_ENV: 'production'
    }
  }]
};
```

---

## 🚀 **DÉPLOIEMENT**

### **1. Clonage et Installation**
```bash
# Création du répertoire
sudo mkdir -p /var/www/communiconnect
sudo chown $USER:$USER /var/www/communiconnect

# Clonage du projet
cd /var/www/communiconnect
git clone https://github.com/votre-repo/CommuniConnect.git .

# Installation des dépendances
npm run install-all

# Build de l'application
npm run build
```

### **2. Configuration des Logs**
```bash
# Création des répertoires de logs
sudo mkdir -p /var/log/communiconnect
sudo chown $USER:$USER /var/log/communiconnect

# Configuration de la rotation des logs
sudo nano /etc/logrotate.d/communiconnect

/var/log/communiconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
```

### **3. Démarrage de l'Application**
```bash
# Démarrage avec PM2
pm2 start ecosystem.config.js

# Sauvegarde de la configuration PM2
pm2 save
pm2 startup

# Vérification du statut
pm2 status
pm2 logs
```

---

## 🔒 **SÉCURITÉ**

### **1. Certificats SSL**
```bash
# Installation des certificats Let's Encrypt
sudo certbot --nginx -d communiconnect.gn -d www.communiconnect.gn
sudo certbot --nginx -d api.communiconnect.gn

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

### **2. Configuration Sécurité Nginx**
```bash
# Ajout des headers de sécurité
sudo nano /etc/nginx/sites-available/communiconnect

# Dans le bloc server, ajouter :
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

### **3. Monitoring et Alertes**
```bash
# Installation de monitoring
pm2 install pm2-server-monit

# Configuration des alertes
pm2 set pm2-server-monit:email your-email@example.com
pm2 set pm2-server-monit:threshold 80
```

---

## 📊 **MONITORING ET MAINTENANCE**

### **1. Scripts de Maintenance**
```bash
# Création du script de maintenance
sudo nano /var/www/communiconnect/scripts/maintenance.sh

#!/bin/bash
# Script de maintenance CommuniConnect

echo "🔄 Démarrage de la maintenance..."

# Sauvegarde de la base de données
mongodump --db communiconnect_prod --out /var/backups/communiconnect/$(date +%Y%m%d)

# Nettoyage des logs
find /var/log/communiconnect -name "*.log" -mtime +30 -delete

# Redémarrage des services
pm2 restart all

echo "✅ Maintenance terminée"
```

### **2. Sauvegarde Automatique**
```bash
# Configuration de la sauvegarde
sudo crontab -e

# Ajouter : 0 2 * * * /var/www/communiconnect/scripts/maintenance.sh
```

---

## 🎯 **VALIDATION DU DÉPLOIEMENT**

### **1. Tests de Validation**
```bash
# Test de l'API
curl -X GET https://api.communiconnect.gn/api/health

# Test du frontend
curl -X GET https://communiconnect.gn

# Test des certificats SSL
sudo certbot certificates
```

### **2. Tests de Performance**
```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 https://communiconnect.gn/

# Monitoring des ressources
htop
pm2 monit
```

---

## 🚨 **DÉPANNAGE**

### **1. Problèmes Courants**
- **Port déjà utilisé** : `sudo lsof -i :5000` puis `sudo kill -9 PID`
- **Permissions** : `sudo chown -R $USER:$USER /var/www/communiconnect`
- **Logs** : `pm2 logs` ou `tail -f /var/log/communiconnect/app.log`

### **2. Redémarrage Complet**
```bash
# Redémarrage complet
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

---

## 📞 **SUPPORT**

### **Contacts**
- **Développeur** : votre-email@example.com
- **Administrateur** : admin@communiconnect.gn
- **Support** : support@communiconnect.gn

### **Documentation**
- **API** : https://api.communiconnect.gn/docs
- **Admin** : https://admin.communiconnect.gn
- **Monitoring** : `pm2 monit`

---

*Guide créé le : 1er Août 2024*  
*Version : 1.0*  
*Statut : ✅ PRÊT POUR PRODUCTION* 