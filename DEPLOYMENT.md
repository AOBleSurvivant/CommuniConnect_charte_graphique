# 🚀 Guide de Déploiement CommuniConnect

## 📋 Prérequis

- Compte GitHub
- Compte Vercel (gratuit)
- Compte Render (gratuit)
- Compte MongoDB Atlas (gratuit)

## 🎯 Architecture de Déploiement

```
Frontend (React) → Vercel
Backend (Node.js) → Render
Base de données → MongoDB Atlas
```

## 📦 Étape 1 : Préparation du Repository

### 1.1 Structure du projet
```
communiConnect_gn/
├── client/          # Frontend React
├── server/          # Backend Node.js
├── vercel.json      # Configuration Vercel
└── DEPLOYMENT.md    # Ce guide
```

### 1.2 Variables d'environnement

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://communiconnect-api.onrender.com/api
REACT_APP_SOCKET_URL=https://communiconnect-api.onrender.com
REACT_APP_ENV=production
```

**Backend (.env)**
```env
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communiconnect
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://communiconnect.vercel.app
```

## 🗄️ Étape 2 : Base de Données MongoDB Atlas

### 2.1 Créer un compte MongoDB Atlas
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un nouveau cluster (gratuit)

### 2.2 Configuration du cluster
1. **Network Access** : Ajoutez `0.0.0.0/0` pour permettre l'accès depuis Render
2. **Database Access** : Créez un utilisateur avec mot de passe
3. **Connect** : Obtenez votre URI de connexion

### 2.3 URI de connexion
```
mongodb+srv://username:password@cluster.mongodb.net/communiconnect
```

## ⚙️ Étape 3 : Déploiement Backend sur Render

### 3.1 Créer un compte Render
1. Allez sur [Render](https://render.com)
2. Créez un compte gratuit
3. Connectez votre compte GitHub

### 3.2 Déployer le serveur
1. **New Web Service**
2. **Connect Repository** : Sélectionnez votre repo GitHub
3. **Configuration** :
   - **Name** : `communiconnect-api`
   - **Root Directory** : `server`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

### 3.3 Variables d'environnement
Dans Render, ajoutez ces variables :
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communiconnect
JWT_SECRET=your-super-secret-jwt-key-change-this
CORS_ORIGIN=https://communiconnect.vercel.app
```

### 3.4 Déployer
1. Cliquez sur **Create Web Service**
2. Attendez le déploiement (5-10 minutes)
3. Notez l'URL : `https://communiconnect-api.onrender.com`

## 🌐 Étape 4 : Déploiement Frontend sur Vercel

### 4.1 Créer un compte Vercel
1. Allez sur [Vercel](https://vercel.com)
2. Créez un compte gratuit
3. Connectez votre compte GitHub

### 4.2 Déployer le frontend
1. **New Project**
2. **Import Git Repository** : Sélectionnez votre repo
3. **Configuration** :
   - **Framework Preset** : `Create React App`
   - **Root Directory** : `client`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`

### 4.3 Variables d'environnement
Dans Vercel, ajoutez :
```
REACT_APP_API_URL=https://communiconnect-api.onrender.com/api
REACT_APP_SOCKET_URL=https://communiconnect-api.onrender.com
REACT_APP_ENV=production
```

### 4.4 Déployer
1. Cliquez sur **Deploy**
2. Attendez le déploiement (2-3 minutes)
3. Votre app sera disponible sur : `https://communiconnect.vercel.app`

## 🔧 Étape 5 : Configuration Post-Déploiement

### 5.1 Vérifier les URLs
- **Frontend** : `https://communiconnect.vercel.app`
- **Backend** : `https://communiconnect-api.onrender.com`
- **API Health Check** : `https://communiconnect-api.onrender.com/api/health`

### 5.2 Tester l'application
1. Ouvrez votre frontend
2. Testez la connexion
3. Testez les fonctionnalités principales

### 5.3 Configuration des domaines personnalisés (optionnel)
- **Vercel** : Ajoutez votre domaine dans les paramètres
- **Render** : Configurez un domaine personnalisé

## 🔄 Déploiement Automatique

### GitHub Actions (optionnel)
Créez `.github/workflows/deploy.yml` :
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📊 Monitoring et Maintenance

### 6.1 Logs
- **Vercel** : Dashboard → Analytics
- **Render** : Dashboard → Logs

### 6.2 Performance
- **Vercel Analytics** : Gratuit pour les projets personnels
- **Render** : Monitoring intégré

### 6.3 Sauvegarde
- **MongoDB Atlas** : Sauvegarde automatique
- **Code** : GitHub (versioning)

## 🚨 Dépannage

### Problèmes courants

**1. CORS Errors**
- Vérifiez `CORS_ORIGIN` dans le backend
- Assurez-vous que l'URL frontend est correcte

**2. MongoDB Connection**
- Vérifiez l'URI de connexion
- Vérifiez les permissions Network Access

**3. Build Errors**
- Vérifiez les dépendances dans package.json
- Vérifiez les variables d'environnement

**4. API 404**
- Vérifiez les routes dans le backend
- Vérifiez la configuration Vercel

## 💰 Coûts

### Gratuit (Limites)
- **Vercel** : 100GB bande passante/mois
- **Render** : 750h/mois
- **MongoDB Atlas** : 512MB stockage

### Upgrade (si nécessaire)
- **Vercel Pro** : $20/mois
- **Render** : $7/mois
- **MongoDB Atlas** : $9/mois

## 🎉 Félicitations !

Votre application CommuniConnect est maintenant déployée gratuitement !

**URLs finales :**
- 🌐 **Frontend** : `https://communiconnect.vercel.app`
- ⚙️ **Backend** : `https://communiconnect-api.onrender.com`
- 📊 **Base de données** : MongoDB Atlas

**Prochaines étapes :**
1. Testez toutes les fonctionnalités
2. Configurez les domaines personnalisés
3. Ajoutez les services optionnels (Cloudinary, Twilio, etc.)
4. Configurez les notifications push 