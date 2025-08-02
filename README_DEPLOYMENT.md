# 🚀 Déploiement Gratuit CommuniConnect

## 🎯 Vue d'ensemble

Ce guide vous accompagne pour déployer **CommuniConnect** gratuitement sur les meilleures plateformes cloud.

### 📊 Architecture de déploiement

```
🌐 Frontend (React)     → Vercel (Gratuit)
⚙️  Backend (Node.js)   → Render (Gratuit)
🗄️  Base de données     → MongoDB Atlas (Gratuit)
```

## ⚡ Déploiement Rapide (5 minutes)

### 1. Prérequis
- ✅ Compte GitHub
- ✅ Compte Vercel (gratuit)
- ✅ Compte Render (gratuit)
- ✅ Compte MongoDB Atlas (gratuit)

### 2. Étapes de déploiement

#### 🗄️ Étape 1 : Base de données MongoDB Atlas
1. Allez sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créez un compte gratuit
3. Créez un cluster gratuit (M0)
4. **Network Access** : Ajoutez `0.0.0.0/0`
5. **Database Access** : Créez un utilisateur
6. **Connect** : Copiez votre URI de connexion

#### ⚙️ Étape 2 : Backend sur Render
1. Allez sur [Render](https://render.com)
2. Créez un compte gratuit
3. **New Web Service** → Connectez votre repo GitHub
4. Configuration :
   - **Name** : `communiconnect-api`
   - **Root Directory** : `server`
   - **Runtime** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`

5. **Environment Variables** :
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communiconnect
   JWT_SECRET=your-super-secret-jwt-key-change-this
   CORS_ORIGIN=https://communiconnect.vercel.app
   ```

6. **Create Web Service** et attendez le déploiement

#### 🌐 Étape 3 : Frontend sur Vercel
1. Allez sur [Vercel](https://vercel.com)
2. Créez un compte gratuit
3. **New Project** → Importez votre repo GitHub
4. Configuration :
   - **Framework Preset** : `Create React App`
   - **Root Directory** : `client`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`

5. **Environment Variables** :
   ```
   REACT_APP_API_URL=https://communiconnect-api.onrender.com/api
   REACT_APP_SOCKET_URL=https://communiconnect-api.onrender.com
   REACT_APP_ENV=production
   ```

6. **Deploy** et attendez le déploiement

## 🔧 Configuration Avancée

### Variables d'environnement détaillées

#### Backend (Render)
```env
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/communiconnect
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=https://communiconnect.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (Vercel)
```env
REACT_APP_API_URL=https://communiconnect-api.onrender.com/api
REACT_APP_SOCKET_URL=https://communiconnect-api.onrender.com
REACT_APP_ENV=production
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_FACEBOOK_CLIENT_ID=your-facebook-client-id
```

### Services optionnels

#### Cloudinary (Images)
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Twilio (SMS)
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Firebase (Notifications)
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

## 🧪 Tests post-déploiement

### 1. Test de l'API
```bash
curl https://communiconnect-api.onrender.com/api/health
```

### 2. Test du frontend
- Ouvrez votre URL Vercel
- Testez la connexion
- Testez les fonctionnalités principales

### 3. Test des WebSockets
- Vérifiez les notifications en temps réel
- Testez la messagerie

## 📊 Monitoring

### Vercel Analytics
- **Dashboard** → Analytics
- **Performance** : Core Web Vitals
- **Trafic** : Visiteurs et pages

### Render Monitoring
- **Dashboard** → Logs
- **Performance** : Temps de réponse
- **Erreurs** : Logs d'erreur

### MongoDB Atlas
- **Database** → Performance Advisor
- **Monitoring** : Métriques en temps réel

## 🚨 Dépannage

### Problèmes courants

#### 1. CORS Errors
```
Access to fetch at 'https://api.onrender.com' from origin 'https://app.vercel.app' has been blocked by CORS policy
```
**Solution** : Vérifiez `CORS_ORIGIN` dans Render

#### 2. MongoDB Connection
```
MongoNetworkError: connect ECONNREFUSED
```
**Solution** : Vérifiez l'URI et les permissions Network Access

#### 3. Build Errors
```
Build failed: npm run build
```
**Solution** : Vérifiez les dépendances et variables d'environnement

#### 4. API 404
```
GET /api/health 404 Not Found
```
**Solution** : Vérifiez les routes et la configuration

## 💰 Coûts et limites

### Gratuit (Limites)
- **Vercel** : 100GB bande passante/mois
- **Render** : 750h/mois (dormance après 15min d'inactivité)
- **MongoDB Atlas** : 512MB stockage

### Upgrade recommandé
- **Vercel Pro** : $20/mois (bande passante illimitée)
- **Render** : $7/mois (pas de dormance)
- **MongoDB Atlas** : $9/mois (2GB stockage)

## 🔄 Déploiement automatique

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

## 🎉 URLs finales

Après le déploiement, vous aurez :
- 🌐 **Frontend** : `https://communiconnect.vercel.app`
- ⚙️ **Backend** : `https://communiconnect-api.onrender.com`
- 📊 **Base de données** : MongoDB Atlas

## 📞 Support

### Ressources utiles
- 📖 [Guide complet](DEPLOYMENT.md)
- 🐛 [Issues GitHub](https://github.com/votre-repo/issues)
- 💬 [Discord CommuniConnect](https://discord.gg/communiconnect)

### Commandes utiles
```bash
# Test local
npm run dev

# Build local
npm run build

# Test API
curl http://localhost:5000/api/health

# Logs Render
# Dashboard → Logs

# Logs Vercel
# Dashboard → Functions → Logs
```

---

**CommuniConnect** - Connecter les communautés guinéennes 🌍

*Déployé avec ❤️ sur Vercel + Render + MongoDB Atlas* 