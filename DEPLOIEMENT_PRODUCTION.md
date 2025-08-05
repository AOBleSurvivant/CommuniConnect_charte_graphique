# 🚀 GUIDE DE DÉPLOIEMENT PRODUCTION - COMMUNICONNECT

## 📋 PRÉREQUIS

### **Serveur de Production**
- **OS** : Ubuntu 20.04+ ou CentOS 8+
- **RAM** : Minimum 4GB (recommandé 8GB+)
- **CPU** : 2 cœurs minimum (recommandé 4+)
- **Stockage** : 50GB minimum
- **Réseau** : Connexion stable avec IP publique

### **Services Requis**
- **Node.js** : Version 18+ LTS
- **PM2** : Gestionnaire de processus
- **Nginx** : Serveur web reverse proxy
- **MongoDB** : Base de données (ou Atlas)
- **Redis** : Cache (optionnel)
- **SSL Certificate** : Let's Encrypt

---

## 🔧 CONFIGURATION DU SERVEUR

### **1. Installation des Dépendances**

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Installation de PM2
sudo npm install -g pm2

# Installation de Nginx
sudo apt install nginx -y

# Installation de MongoDB (optionnel si Atlas)
sudo apt install mongodb -y
```

### **2. Configuration de l'Environnement**

```bash
# Créer le dossier de l'application
sudo mkdir -p /var/www/communiconnect
sudo chown $USER:$USER /var/www/communiconnect

# Cloner le projet
cd /var/www/communiconnect
git clone https://github.com/votre-repo/communiconnect.git .

# Installer les dépendances
npm run install-all
```

### **3. Variables d'Environnement**

Créer le fichier `.env` dans le dossier `server/` :

```env
# Configuration de base
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Base de données
MONGODB_URI=mongodb://localhost:27017/communiconnect
# Ou pour Atlas : mongodb+srv://user:password@cluster.mongodb.net/communiconnect

# JWT
JWT_SECRET=votre-secret-jwt-tres-securise
JWT_EXPIRE=7d

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# Email (pour les notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app

# Upload de fichiers
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/var/www/communiconnect/uploads

# Sécurité
CORS_ORIGIN=https://communiconnect.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Monitoring
ENABLE_MONITORING=true
LOG_LEVEL=info
```

---

## 🏗️ CONFIGURATION NGINX

### **1. Configuration du Site**

Créer `/etc/nginx/sites-available/communiconnect` :

```nginx
server {
    listen 80;
    server_name communiconnect.com www.communiconnect.com;
    
    # Redirection vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name communiconnect.com www.communiconnect.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/communiconnect.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/communiconnect.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
    
    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Frontend React
    location / {
        root /var/www/communiconnect/client/build;
        try_files $uri $uri/ /index.html;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Static files
    location /static {
        alias /var/www/communiconnect/server/static;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;
}
```

### **2. Activation du Site**

```bash
# Activer le site
sudo ln -s /etc/nginx/sites-available/communiconnect /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🔒 CONFIGURATION SSL

### **1. Installation de Certbot**

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat SSL
sudo certbot --nginx -d communiconnect.com -d www.communiconnect.com

# Renouvellement automatique
sudo crontab -e
# Ajouter : 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🚀 DÉPLOIEMENT AVEC PM2

### **1. Configuration PM2**

Créer `ecosystem.config.js` à la racine :

```javascript
module.exports = {
  apps: [
    {
      name: 'communiconnect-server',
      script: './server/index.js',
      cwd: '/var/www/communiconnect',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/communiconnect/err.log',
      out_file: '/var/log/communiconnect/out.log',
      log_file: '/var/log/communiconnect/combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    }
  ]
};
```

### **2. Script de Déploiement**

Créer `deploy.sh` :

```bash
#!/bin/bash

echo "🚀 Déploiement de CommuniConnect..."

# Arrêter l'application
pm2 stop communiconnect-server || true

# Pull des dernières modifications
git pull origin main

# Installer les dépendances
npm run install-all

# Build du frontend
cd client && npm run build && cd ..

# Démarrer l'application
pm2 start ecosystem.config.js --env production

# Sauvegarder la configuration PM2
pm2 save

# Redémarrer PM2 au boot
pm2 startup

echo "✅ Déploiement terminé !"
```

### **3. Exécution du Déploiement**

```bash
# Rendre le script exécutable
chmod +x deploy.sh

# Exécuter le déploiement
./deploy.sh
```

---

## 📊 MONITORING ET LOGS

### **1. Configuration des Logs**

```bash
# Créer le dossier de logs
sudo mkdir -p /var/log/communiconnect
sudo chown $USER:$USER /var/log/communiconnect

# Rotation des logs
sudo tee /etc/logrotate.d/communiconnect << EOF
/var/log/communiconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF
```

### **2. Monitoring PM2**

```bash
# Voir les processus
pm2 list

# Voir les logs
pm2 logs communiconnect-server

# Monitor en temps réel
pm2 monit

# Statistiques
pm2 show communiconnect-server
```

---

## 🔧 MAINTENANCE

### **1. Sauvegarde de la Base de Données**

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/communiconnect"

mkdir -p $BACKUP_DIR

# Sauvegarde MongoDB
mongodump --db communiconnect --out $BACKUP_DIR/mongodb_$DATE

# Compression
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz $BACKUP_DIR/mongodb_$DATE

# Nettoyage (garder 7 jours)
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete

echo "Sauvegarde terminée: backup_$DATE.tar.gz"
```

### **2. Mise à Jour Automatique**

```bash
# Ajouter au crontab
crontab -e

# Mise à jour quotidienne à 2h du matin
0 2 * * * cd /var/www/communiconnect && ./deploy.sh >> /var/log/communiconnect/deploy.log 2>&1

# Sauvegarde quotidienne à 1h du matin
0 1 * * * /var/www/communiconnect/backup.sh >> /var/log/communiconnect/backup.log 2>&1
```

---

## 🚨 SÉCURITÉ

### **1. Firewall**

```bash
# Configuration UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
```

### **2. Fail2ban**

```bash
# Installation
sudo apt install fail2ban -y

# Configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Redémarrer
sudo systemctl restart fail2ban
sudo systemctl enable fail2ban
```

---

## 📈 OPTIMISATIONS

### **1. Performance**

- **CDN** : Cloudflare pour les assets statiques
- **Cache Redis** : Pour les sessions et données fréquentes
- **Compression** : Gzip activé dans Nginx
- **Monitoring** : New Relic ou DataDog

### **2. Scalabilité**

- **Load Balancer** : HAProxy ou Nginx Plus
- **Base de données** : Réplication MongoDB
- **Cache** : Redis Cluster
- **Conteneurs** : Docker + Kubernetes

---

## ✅ VÉRIFICATION POST-DÉPLOIEMENT

### **1. Tests de Fonctionnalité**

```bash
# Test de l'API
curl -X GET https://communiconnect.com/api/health

# Test du frontend
curl -X GET https://communiconnect.com

# Test SSL
curl -I https://communiconnect.com
```

### **2. Monitoring**

```bash
# Vérifier les processus
pm2 list

# Vérifier les logs
pm2 logs --lines 50

# Vérifier les ressources
htop
```

---

## 🎉 CONCLUSION

Votre application CommuniConnect est maintenant déployée en production avec :

- ✅ **Sécurité** : SSL, Firewall, Fail2ban
- ✅ **Performance** : Nginx, PM2, Gzip
- ✅ **Monitoring** : Logs, PM2, Alertes
- ✅ **Maintenance** : Sauvegardes, Mises à jour automatiques
- ✅ **Scalabilité** : Architecture prête pour l'extension

**Votre plateforme est prête pour les utilisateurs !** 🚀 