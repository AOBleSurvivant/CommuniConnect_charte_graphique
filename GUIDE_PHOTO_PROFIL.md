# 📸 GUIDE - RÉSOLUTION PROBLÈMES PHOTO DE PROFIL

## 🎯 **PROBLÈME IDENTIFIÉ**

Vous avez du mal à changer votre photo de profil dans CommuniConnect. Voici les solutions étape par étape.

---

## 🔍 **DIAGNOSTIC RAPIDE**

### **Étape 1: Vérifier le serveur**
```bash
# Ouvrir un terminal dans le dossier server/
cd server
npm start
```

**Vérifiez que:**
- Le serveur démarre sur le port 5000
- Pas d'erreurs dans la console
- Message "Serveur démarré sur le port 5000"

### **Étape 2: Vérifier l'authentification**
1. Ouvrez http://localhost:3000
2. Connectez-vous avec vos identifiants
3. Vérifiez que vous êtes bien connecté

### **Étape 3: Tester l'upload**
1. Allez sur votre page de profil
2. Cliquez sur l'icône caméra sur votre avatar
3. Sélectionnez une image
4. Vérifiez les messages d'erreur

---

## 🛠️ **SOLUTIONS AUTOMATIQUES**

### **Solution 1: Diagnostic complet**
```bash
node diagnostic-photo-profil.js
```

### **Solution 2: Correction automatique**
```bash
node correction-photo-profil.js
```

### **Solution 3: Redémarrage complet**
```bash
# Arrêter tous les serveurs (Ctrl+C)
# Puis redémarrer:
cd server && npm start
# Dans un autre terminal:
cd client && npm start
```

---

## 🔧 **PROBLÈMES COURANTS ET SOLUTIONS**

### **❌ Problème: "Serveur inaccessible"**
**Solution:**
```bash
cd server
npm install
npm start
```

### **❌ Problème: "Erreur CORS"**
**Solution:**
```bash
# Vérifier que le serveur est démarré
# Vérifier que vous êtes sur http://localhost:3000
# Redémarrer le serveur
```

### **❌ Problème: "Fichier trop volumineux"**
**Solution:**
- Utilisez des images de moins de 5MB
- Compressez votre image avant l'upload
- Formats acceptés: JPG, PNG, GIF

### **❌ Problème: "Aucun fichier fourni"**
**Solution:**
- Vérifiez que vous sélectionnez bien un fichier
- Vérifiez que le fichier est une image
- Essayez avec une image différente

### **❌ Problème: "Erreur d'authentification"**
**Solution:**
- Déconnectez-vous et reconnectez-vous
- Vérifiez que votre token est valide
- Redémarrez l'application

---

## 📋 **CHECKLIST DE VÉRIFICATION**

### **✅ Serveur Backend**
- [ ] Serveur démarré sur le port 5000
- [ ] Pas d'erreurs dans la console
- [ ] API accessible: http://localhost:5000/api/auth/status

### **✅ Client Frontend**
- [ ] Application démarrée sur le port 3000
- [ ] Vous êtes connecté
- [ ] Pas d'erreurs dans la console du navigateur

### **✅ Configuration**
- [ ] Dossier `server/static/avatars/` existe
- [ ] Dépendances installées: `multer`, `cors`
- [ ] Configuration CORS correcte

### **✅ Upload**
- [ ] Image sélectionnée
- [ ] Taille < 5MB
- [ ] Format image valide
- [ ] Pas d'erreur réseau

---

## 🎯 **PROCÉDURE COMPLÈTE**

### **1. Diagnostic**
```bash
node diagnostic-photo-profil.js
```

### **2. Correction**
```bash
node correction-photo-profil.js
```

### **3. Redémarrage**
```bash
# Terminal 1 - Serveur
cd server
npm start

# Terminal 2 - Client
cd client
npm start
```

### **4. Test**
1. Ouvrez http://localhost:3000
2. Connectez-vous
3. Allez sur votre profil
4. Cliquez sur l'icône caméra
5. Sélectionnez une image
6. Vérifiez que l'upload fonctionne

---

## 🚨 **EN CAS D'ÉCHEC**

### **Solution de dernier recours:**
1. **Arrêter tous les serveurs**
2. **Supprimer node_modules et réinstaller:**
   ```bash
   cd server && rm -rf node_modules package-lock.json && npm install
   cd ../client && rm -rf node_modules package-lock.json && npm install
   ```
3. **Redémarrer:**
   ```bash
   cd server && npm start
   cd ../client && npm start
   ```

### **Vérification manuelle:**
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet "Network"
3. Essayez d'uploader une photo
4. Vérifiez les requêtes réseau
5. Identifiez les erreurs

---

## 💡 **TIPS UTILES**

### **Pour un upload réussi:**
- Utilisez des images carrées (1:1 ratio)
- Taille recommandée: 200x200 pixels
- Format: JPG ou PNG
- Taille: moins de 1MB

### **Pour déboguer:**
- Ouvrez la console du navigateur (F12)
- Vérifiez les erreurs JavaScript
- Vérifiez les requêtes réseau
- Testez avec une image simple

### **Pour tester:**
- Utilisez une image de test simple
- Vérifiez que l'image s'affiche après upload
- Testez sur différents navigateurs

---

## 📞 **SUPPORT**

Si le problème persiste après avoir suivi ce guide:

1. **Exécutez le diagnostic complet**
2. **Notez les erreurs exactes**
3. **Vérifiez les logs du serveur**
4. **Testez avec une image différente**

**Messages d'erreur courants:**
- `ECONNREFUSED` → Serveur non démarré
- `401 Unauthorized` → Problème d'authentification
- `413 Payload Too Large` → Image trop volumineuse
- `CORS error` → Problème de configuration CORS

---

*Guide créé pour résoudre les problèmes de photo de profil dans CommuniConnect* 