# 🗄️ CONFIGURATION MONGODB ATLAS - GUIDE AUTOMATIQUE

## 📋 **ÉTAPES DE CONFIGURATION**

### **1. Création du Compte MongoDB Atlas**
- Allez sur : https://mongodb.com/atlas
- Cliquez sur "Try Free"
- Remplissez le formulaire :
  - **Email** : communiconnectgn@gmail.com
  - **Mot de passe** : [votre mot de passe sécurisé]
  - **Nom d'utilisateur** : communiconnectgn

### **2. Création du Cluster Gratuit**
- Choisissez "FREE" (Shared, Dedicated)
- **Nom du cluster** : communiconnect-cluster
- **Région** : Europe (Frankfurt ou London)
- **Version** : Latest (7.0)
- Cliquez sur "Create"

### **3. Configuration de la Base de Données**
- **Nom d'utilisateur** : communiconnect
- **Mot de passe** : CommuniConnect2025!
- **Base de données** : communiconnect
- **Collection** : users

### **4. Configuration Réseau**
- **IP Access List** : 
  - Ajoutez : 0.0.0.0/0 (pour permettre l'accès depuis Vercel)
  - Ou utilisez "Allow Access from Anywhere"

### **5. Récupération de l'URI**
L'URI ressemblera à :
```
mongodb+srv://communiconnect:CommuniConnect2025!@cluster0.xxxxx.mongodb.net/communiconnect?retryWrites=true&w=majority
```

## 🔧 **VARIABLES D'ENVIRONNEMENT À CONFIGURER**

Une fois l'URI récupéré, configurez ces variables dans Vercel :

```env
MONGODB_URI=mongodb+srv://communiconnect:CommuniConnect2025!@cluster0.xxxxx.mongodb.net/communiconnect?retryWrites=true&w=majority
JWT_SECRET=communiconnect_secret_key_2025_very_long_and_secure_minimum_32_characters
NODE_ENV=production
CORS_ORIGIN=https://votre-app.vercel.app
```

## 🚀 **DÉPLOIEMENT AUTOMATIQUE**

Une fois MongoDB configuré, exécutez :
```bash
npm run deploy
```

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :
1. Vérifiez que l'URI MongoDB est correct
2. Vérifiez que les variables d'environnement sont configurées dans Vercel
3. Consultez les logs Vercel : `vercel logs` 