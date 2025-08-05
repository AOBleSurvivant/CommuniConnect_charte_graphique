# 🚀 GUIDE DÉPLOIEMENT WINDOWS - COMMUNICONNECT

## 📋 **PRÉREQUIS WINDOWS**

### **1. Logiciels Requis**
- ✅ **Node.js 18+** : [Télécharger](https://nodejs.org/)
- ✅ **Git** : [Télécharger](https://git-scm.com/)
- ✅ **PowerShell 5.1+** (inclus avec Windows 10)
- ✅ **MongoDB** : [Télécharger](https://www.mongodb.com/try/download/community)

### **2. Vérification des Prérequis**
```powershell
# Ouvrir PowerShell en tant qu'administrateur
# Vérifier Node.js
node --version

# Vérifier npm
npm --version

# Vérifier Git
git --version

# Vérifier PowerShell
$PSVersionTable.PSVersion
```

---

## 🛠️ **INSTALLATION ET CONFIGURATION**

### **1. Installation de MongoDB**
```powershell
# Télécharger MongoDB Community Server
# Installer avec les options par défaut
# Démarrer le service MongoDB
Start-Service MongoDB
```

### **2. Installation de PM2**
```powershell
# Installer PM2 globalement
npm install -g pm2

# Vérifier l'installation
pm2 --version
```

### **3. Configuration du Projet**
```powershell
# Cloner le projet (si pas déjà fait)
git clone https://github.com/votre-repo/CommuniConnect.git
cd CommuniConnect

# Installer les dépendances
npm run install-all
```

---

## 🚀 **DÉPLOIEMENT AUTOMATISÉ**

### **1. Script de Déploiement**
Le script `deploy-production.ps1` automatise tout le processus :

```powershell
# Exécuter le script de déploiement
.\deploy-production.ps1

# Ou avec des options
.\deploy-production.ps1 -Environment production -Domain communiconnect.gn
```

### **2. Options du Script**
- `-Environment` : Environnement (production, staging)
- `-Domain` : Domaine de production
- `-SkipTests` : Ignorer les tests pré-déploiement
- `-Force` : Forcer le déploiement même en cas d'erreurs

---

## 🔧 **CONFIGURATION MANUELLE**

### **1. Variables d'Environnement**
Créer le fichier `.env.production` :
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=votre_secret_tres_securise_production_2024
JWT_EXPIRE=7d

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/communiconnect_prod

# CORS
CORS_ORIGIN=https://communiconnect.gn

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# Sécurité
RATE_LIMIT_WINDOW=15m
RATE_LIMIT_MAX=100
```

### **2. Configuration PM2**
Créer le fichier `ecosystem.config.js` :
```javascript
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
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    time: true,
    max_memory_restart: '1G'
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

## 📦 **ÉTAPES DE DÉPLOIEMENT**

### **1. Préparation**
```powershell
# Créer les répertoires nécessaires
New-Item -ItemType Directory -Path "logs" -Force
New-Item -ItemType Directory -Path "backups" -Force

# Installer les dépendances
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

### **2. Build de l'Application**
```powershell
# Build du client React
cd client
npm run build
cd ..
```

### **3. Démarrage avec PM2**
```powershell
# Arrêter les processus existants
pm2 stop all
pm2 delete all

# Démarrer les services
pm2 start ecosystem.config.js

# Sauvegarder la configuration
pm2 save

# Vérifier le statut
pm2 status
```

### **4. Vérification**
```powershell
# Test de l'API
Invoke-WebRequest -Uri "http://localhost:5000/api/health"

# Test du client
Invoke-WebRequest -Uri "http://localhost:3000"

# Vérifier les logs
pm2 logs
```

---

## 🔒 **SÉCURITÉ WINDOWS**

### **1. Configuration Firewall**
```powershell
# Ouvrir les ports nécessaires
New-NetFirewallRule -DisplayName "CommuniConnect API" -Direction Inbound -Protocol TCP -LocalPort 5000 -Action Allow
New-NetFirewallRule -DisplayName "CommuniConnect Client" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
```

### **2. Service Windows**
```powershell
# Créer un service Windows pour PM2
pm2 startup windows

# Installer le service
pm2 save
```

### **3. Monitoring**
```powershell
# Monitoring en temps réel
pm2 monit

# Logs en temps réel
pm2 logs

# Statistiques
pm2 status
```

---

## 🚨 **DÉPANNAGE WINDOWS**

### **1. Problèmes Courants**

#### **Port déjà utilisé**
```powershell
# Vérifier les ports utilisés
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Tuer le processus
taskkill /PID <PID> /F
```

#### **Permissions**
```powershell
# Exécuter PowerShell en tant qu'administrateur
# Ou donner les permissions
icacls . /grant "Users":(OI)(CI)F
```

#### **MongoDB ne démarre pas**
```powershell
# Vérifier le service MongoDB
Get-Service MongoDB

# Démarrer le service
Start-Service MongoDB

# Vérifier la configuration
Get-Content "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg"
```

### **2. Logs et Debugging**
```powershell
# Logs PM2
pm2 logs

# Logs système
Get-EventLog -LogName Application -Source "CommuniConnect"

# Logs MongoDB
Get-Content "C:\Program Files\MongoDB\Server\6.0\log\mongod.log"
```

---

## 📊 **MONITORING ET MAINTENANCE**

### **1. Scripts de Maintenance**
```powershell
# Créer un script de maintenance
$MaintenanceScript = @"
# Script de maintenance CommuniConnect
Write-Host "🔄 Démarrage de la maintenance..."

# Sauvegarde de la base de données
mongodump --db communiconnect_prod --out backups/$(Get-Date -Format 'yyyyMMdd')

# Nettoyage des logs
Get-ChildItem logs\*.log | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)} | Remove-Item

# Redémarrage des services
pm2 restart all

Write-Host "✅ Maintenance terminée"
"@

$MaintenanceScript | Out-File -FilePath "maintenance.ps1" -Encoding UTF8
```

### **2. Tâches Planifiées**
```powershell
# Créer une tâche planifiée pour la maintenance
$Action = New-ScheduledTaskAction -Execute "PowerShell.exe" -Argument "-File C:\path\to\maintenance.ps1"
$Trigger = New-ScheduledTaskTrigger -Daily -At 2AM
Register-ScheduledTask -TaskName "CommuniConnect Maintenance" -Action $Action -Trigger $Trigger
```

---

## 🎯 **VALIDATION DU DÉPLOIEMENT**

### **1. Tests de Validation**
```powershell
# Test de l'API
$Response = Invoke-WebRequest -Uri "http://localhost:5000/api/health"
if ($Response.StatusCode -eq 200) {
    Write-Host "✅ API opérationnelle"
} else {
    Write-Host "❌ API non accessible"
}

# Test du client
$Response = Invoke-WebRequest -Uri "http://localhost:3000"
if ($Response.StatusCode -eq 200) {
    Write-Host "✅ Client opérationnel"
} else {
    Write-Host "❌ Client non accessible"
}
```

### **2. Tests de Performance**
```powershell
# Exécuter les tests de performance
node test-performance-optimise.js
```

---

## 📞 **SUPPORT WINDOWS**

### **1. Commandes Utiles**
```powershell
# Statut des services
pm2 status

# Logs en temps réel
pm2 logs

# Monitoring
pm2 monit

# Redémarrage
pm2 restart all

# Arrêt
pm2 stop all

# Démarrage
pm2 start all
```

### **2. Fichiers Importants**
- **Configuration** : `ecosystem.config.js`
- **Variables d'environnement** : `.env.production`
- **Logs** : `logs/` directory
- **Sauvegardes** : `backups/` directory
- **Script de déploiement** : `deploy-production.ps1`

### **3. Contacts**
- **Développeur** : votre-email@example.com
- **Support Windows** : support@communiconnect.gn
- **Documentation** : `GUIDE_DEPLOIEMENT_PRODUCTION.md`

---

## 🎉 **FÉLICITATIONS !**

Votre application **CommuniConnect** est maintenant déployée en production sur Windows !

### **📊 Informations Finales**
- **API** : http://localhost:5000
- **Client** : http://localhost:3000
- **Monitoring** : `pm2 monit`
- **Logs** : `logs/` directory

### **🔧 Prochaines Étapes**
1. **Tests utilisateur** avec des utilisateurs réels
2. **Optimisations** basées sur les retours
3. **Fonctionnalités avancées** (notifications push, etc.)
4. **Déploiement sur serveur distant** (optionnel)

---

*Guide créé le : 1er Août 2024*  
*Version : 1.0*  
*Statut : ✅ PRÊT POUR PRODUCTION WINDOWS* 