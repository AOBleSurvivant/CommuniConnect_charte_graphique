# 🚀 GUIDE DE DÉPLOIEMENT PRODUCTION - COMMUNICONNECT

## ✅ **PRÉREQUIS**

### **Serveur de Production**
- **OS** : Ubuntu 20.04 LTS ou plus récent
- **RAM** : 4GB minimum (8GB recommandé)
- **CPU** : 2 cores minimum (4 cores recommandé)
- **Stockage** : 20GB minimum
- **Réseau** : Connexion stable avec IP publique

### **Services Requis**
- **Node.js** : Version 18+ 
- **PM2** : Gestionnaire de processus
- **Nginx** : Reverse proxy
- **MongoDB** : Version 5.0+
- **Redis** : Version 6.0+
- **SSL Certificate** : Let's Encrypt

---

## 🔧 **INSTALLATION ET CONFIGURATION**

### **1. Préparation du Serveur**

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
sudo apt install -y curl wget git build-essential

# Installation Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Vérification
node --version
npm --version
```

### **2. Installation MongoDB**

```bash
# Import de la clé MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Ajout du repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Installation
sudo apt update
sudo apt install -y mongodb-org

# Démarrage et activation
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérification
sudo systemctl status mongod
```

### **3. Installation Redis**

```bash
# Installation Redis
sudo apt install -y redis-server

# Configuration Redis
sudo sed -i 's/supervised no/supervised systemd/' /etc/redis/redis.conf

# Démarrage et activation
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Vérification
redis-cli ping
```

### **4. Installation Nginx**

```bash
# Installation Nginx
sudo apt install -y nginx

# Démarrage et activation
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérification
sudo systemctl status nginx
```

### **5. Installation PM2**

```bash
# Installation PM2 global
sudo npm install -g pm2

# Vérification
pm2 --version
```

---

## 📁 **DÉPLOIEMENT DE L'APPLICATION**

### **1. Clonage du Projet**

```bash
# Création du répertoire
sudo mkdir -p /var/www/communiconnect
sudo chown $USER:$USER /var/www/communiconnect

# Clonage du projet
cd /var/www/communiconnect
git clone https://github.com/votre-repo/communiconnect.git .

# Installation des dépendances
npm install --production
```

### **2. Configuration Environnement**

```bash
# Création du fichier .env
cat > .env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/communiconnect
REDIS_URL=redis://localhost:6379
JWT_SECRET=votre_secret_tres_securise_et_long
CORS_ORIGIN=https://votre-domaine.com
EOF
```

### **3. Configuration PM2**

```bash
# Création du fichier ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'communiconnect',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Création du répertoire logs
mkdir -p logs
```

### **4. Démarrage avec PM2**

```bash
# Démarrage de l'application
pm2 start ecosystem.config.js

# Sauvegarde de la configuration PM2
pm2 save

# Configuration du démarrage automatique
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
```

---

## 🌐 **CONFIGURATION NGINX**

### **1. Configuration du Site**

```bash
# Création du fichier de configuration
sudo tee /etc/nginx/sites-available/communiconnect << EOF
server {
    listen 80;
    server_name votre-domaine.com www.votre-domaine.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Configuration pour les fichiers statiques
    location /static/ {
        alias /var/www/communiconnect/public/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Configuration pour l'API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
```

### **2. Activation du Site**

```bash
# Activation du site
sudo ln -s /etc/nginx/sites-available/communiconnect /etc/nginx/sites-enabled/

# Test de la configuration
sudo nginx -t

# Redémarrage de Nginx
sudo systemctl restart nginx
```

---

## 🔒 **CONFIGURATION SSL**

### **1. Installation Certbot**

```bash
# Installation Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtention du certificat SSL
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Test du renouvellement automatique
sudo certbot renew --dry-run
```

### **2. Configuration SSL Automatique**

```bash
# Ajout du cron pour le renouvellement automatique
sudo crontab -e

# Ajouter cette ligne
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 📊 **MONITORING ET LOGS**

### **1. Configuration des Logs**

```bash
# Création du répertoire de logs
sudo mkdir -p /var/log/communiconnect
sudo chown $USER:$USER /var/log/communiconnect

# Configuration de la rotation des logs
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
# Monitoring en temps réel
pm2 monit

# Statut des processus
pm2 status

# Logs de l'application
pm2 logs communiconnect
```

### **3. Monitoring Système**

```bash
# Installation d'outils de monitoring
sudo apt install -y htop iotop

# Surveillance des ressources
htop
```

---

## 🔄 **SCRIPT DE DÉPLOIEMENT AUTOMATISÉ**

### **1. Création du Script**

```bash
# Création du script de déploiement
cat > deploy.sh << 'EOF'
#!/bin/bash

echo "🚀 Déploiement CommuniConnect..."

# Variables
APP_DIR="/var/www/communiconnect"
BACKUP_DIR="/var/backups/communiconnect"
DATE=$(date +%Y%m%d_%H%M%S)

# Création du backup
echo "📦 Création du backup..."
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $APP_DIR .

# Mise à jour du code
echo "📥 Mise à jour du code..."
cd $APP_DIR
git pull origin main

# Installation des dépendances
echo "📦 Installation des dépendances..."
npm install --production

# Vérification de la configuration
echo "🔍 Vérification de la configuration..."
if [ ! -f .env ]; then
    echo "❌ Fichier .env manquant"
    exit 1
fi

# Redémarrage de l'application
echo "🔄 Redémarrage de l'application..."
pm2 restart communiconnect

# Vérification du statut
echo "✅ Vérification du statut..."
sleep 5
if pm2 status | grep -q "online"; then
    echo "✅ Déploiement réussi"
else
    echo "❌ Échec du déploiement"
    exit 1
fi

echo "🎉 Déploiement terminé avec succès !"
EOF

# Rendre le script exécutable
chmod +x deploy.sh
```

### **2. Utilisation du Script**

```bash
# Exécution du déploiement
./deploy.sh
```

---

## 🛡️ **SÉCURITÉ**

### **1. Configuration Firewall**

```bash
# Installation UFW
sudo apt install -y ufw

# Configuration du firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22

# Activation du firewall
sudo ufw enable
```

### **2. Sécurisation MongoDB**

```bash
# Création d'un utilisateur MongoDB
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "votre_mot_de_passe_securise",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
})

# Configuration de l'authentification
sudo sed -i 's/#security:/security:/' /etc/mongod.conf
sudo sed -i '/security:/a \  authorization: enabled' /etc/mongod.conf

# Redémarrage de MongoDB
sudo systemctl restart mongod
```

### **3. Sécurisation Redis**

```bash
# Configuration Redis avec mot de passe
sudo sed -i 's/# requirepass foobared/requirepass votre_mot_de_passe_redis/' /etc/redis/redis.conf

# Redémarrage de Redis
sudo systemctl restart redis-server
```

---

## 📋 **CHECKLIST DE DÉPLOIEMENT**

### **✅ Préparation**
- [ ] Serveur configuré avec les prérequis
- [ ] Node.js 18+ installé
- [ ] MongoDB installé et configuré
- [ ] Redis installé et configuré
- [ ] Nginx installé et configuré
- [ ] PM2 installé

### **✅ Application**
- [ ] Code déployé sur le serveur
- [ ] Variables d'environnement configurées
- [ ] Dépendances installées
- [ ] Application démarrée avec PM2
- [ ] Logs configurés

### **✅ Web**
- [ ] Nginx configuré
- [ ] Site activé
- [ ] SSL configuré
- [ ] Domaines configurés

### **✅ Sécurité**
- [ ] Firewall configuré
- [ ] MongoDB sécurisé
- [ ] Redis sécurisé
- [ ] SSL activé

### **✅ Monitoring**
- [ ] Logs configurés
- [ ] PM2 monitoring activé
- [ ] Scripts de déploiement créés
- [ ] Sauvegardes configurées

---

## 🎯 **COMMANDES UTILES**

### **Gestion de l'Application**
```bash
# Statut de l'application
pm2 status

# Logs en temps réel
pm2 logs communiconnect

# Redémarrage
pm2 restart communiconnect

# Arrêt
pm2 stop communiconnect

# Démarrage
pm2 start communiconnect
```

### **Monitoring**
```bash
# Monitoring PM2
pm2 monit

# Logs système
sudo journalctl -u nginx
sudo journalctl -u mongod
sudo journalctl -u redis-server

# Ressources système
htop
df -h
free -h
```

### **Maintenance**
```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade

# Nettoyage des logs
sudo logrotate -f /etc/logrotate.d/communiconnect

# Sauvegarde de la base de données
mongodump --db communiconnect --out /var/backups/mongodb/
```

---

## 🎉 **VALIDATION DU DÉPLOIEMENT**

### **1. Tests de Connectivité**
```bash
# Test de l'API
curl -f https://votre-domaine.com/api/health

# Test de la base de données
mongo communiconnect --eval "db.stats()"

# Test de Redis
redis-cli ping
```

### **2. Tests de Performance**
```bash
# Test de charge simple
ab -n 1000 -c 10 https://votre-domaine.com/api/health

# Monitoring en temps réel
pm2 monit
```

### **3. Tests de Sécurité**
```bash
# Test SSL
curl -I https://votre-domaine.com

# Test des headers de sécurité
curl -I https://votre-domaine.com/api/health
```

---

**🎯 Votre application CommuniConnect est maintenant prête pour la production !**

**📞 Support** : En cas de problème, vérifiez les logs et le monitoring PM2.
**🔄 Mises à jour** : Utilisez le script `deploy.sh` pour les déploiements futurs.
**📊 Monitoring** : Surveillez régulièrement les performances et les logs. 