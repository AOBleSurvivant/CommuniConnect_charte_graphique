# 🍃 Configuration MongoDB Atlas pour CommuniConnect

## 📋 Étapes de Configuration

### 1. Créer un compte MongoDB Atlas
1. Aller sur [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Créer un compte gratuit
3. Choisir le plan "Free" (M0)

### 2. Créer un cluster
1. **Nom du cluster** : `communiconnect-cluster`
2. **Provider** : AWS
3. **Region** : Europe (Frankfurt ou Paris)
4. **Cluster Tier** : M0 Sandbox (Free)

### 3. Configurer la sécurité
1. **Database Access** :
   - Créer un utilisateur : `communiconnect-user`
   - Mot de passe : `CommuniConnect2024!`
   - Rôle : `Read and write to any database`

2. **Network Access** :
   - Ajouter l'IP du serveur : `0.0.0.0/0` (pour le développement)
   - Ou l'IP spécifique du serveur de production

### 4. Obtenir la chaîne de connexion
```
mongodb+srv://communiconnect-user:CommuniConnect2024!@communiconnect-cluster.xxxxx.mongodb.net/communiconnect?retryWrites=true&w=majority
```

### 5. Variables d'environnement
```bash
# .env.production
MONGODB_URI=mongodb+srv://communiconnect-user:CommuniConnect2024!@communiconnect-cluster.xxxxx.mongodb.net/communiconnect?retryWrites=true&w=majority
```

### 6. Configuration des index
```javascript
// Index pour les performances
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 })
db.users.createIndex({ "region": 1, "prefecture": 1 })

db.livestreams.createIndex({ "category": 1 })
db.livestreams.createIndex({ "location": "2dsphere" })
db.livestreams.createIndex({ "createdAt": -1 })

db.conversations.createIndex({ "participants": 1 })
db.conversations.createIndex({ "createdAt": -1 })

db.messages.createIndex({ "conversationId": 1 })
db.messages.createIndex({ "createdAt": -1 })

db.friends.createIndex({ "userId": 1 })
db.friends.createIndex({ "friendId": 1 })
```

### 7. Sauvegardes automatiques
1. Aller dans **Backup** dans Atlas
2. Activer les sauvegardes automatiques
3. Configurer la rétention : 7 jours
4. Programmer les sauvegardes : Tous les jours à 2h00

### 8. Monitoring
1. **Metrics** : Surveiller l'utilisation CPU, mémoire, stockage
2. **Logs** : Activer les logs de requêtes
3. **Alerts** : Configurer des alertes pour :
   - Utilisation CPU > 80%
   - Utilisation mémoire > 80%
   - Espace disque > 90%

## 🔧 Migration des données

### Script de migration
```javascript
// scripts/migrate-to-atlas.js
const { MongoClient } = require('mongodb');

async function migrateToAtlas() {
  const localUri = 'mongodb://localhost:27017/communiconnect';
  const atlasUri = process.env.MONGODB_URI;

  const localClient = new MongoClient(localUri);
  const atlasClient = new MongoClient(atlasUri);

  try {
    await localClient.connect();
    await atlasClient.connect();

    const localDb = localClient.db('communiconnect');
    const atlasDb = atlasClient.db('communiconnect');

    // Migrer les collections
    const collections = ['users', 'livestreams', 'conversations', 'messages', 'friends'];

    for (const collectionName of collections) {
      console.log(`Migration de ${collectionName}...`);
      
      const localCollection = localDb.collection(collectionName);
      const atlasCollection = atlasDb.collection(collectionName);

      const documents = await localCollection.find({}).toArray();
      
      if (documents.length > 0) {
        await atlasCollection.insertMany(documents);
        console.log(`${documents.length} documents migrés dans ${collectionName}`);
      }
    }

    console.log('✅ Migration terminée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await localClient.close();
    await atlasClient.close();
  }
}

migrateToAtlas();
```

## 📊 Monitoring et Alertes

### Métriques importantes
- **Connexions actives** : < 100
- **Requêtes par seconde** : < 1000
- **Temps de réponse** : < 100ms
- **Espace disque** : < 80%

### Alertes recommandées
```javascript
// Alertes MongoDB Atlas
{
  "cpu_usage": { "threshold": 80, "unit": "%" },
  "memory_usage": { "threshold": 80, "unit": "%" },
  "disk_usage": { "threshold": 90, "unit": "%" },
  "connection_count": { "threshold": 100, "unit": "count" },
  "query_time": { "threshold": 100, "unit": "ms" }
}
```

## 🔒 Sécurité

### Bonnes pratiques
1. **Chiffrement** : TLS/SSL obligatoire
2. **Authentification** : Utilisateur dédié avec permissions minimales
3. **Réseau** : IP whitelist pour la production
4. **Audit** : Logs d'accès activés
5. **Backup** : Sauvegardes automatiques et testées

### Variables d'environnement de production
```bash
# .env.production
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/communiconnect
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-2024
CORS_ORIGIN=https://communiconnect.gn
PORT=5000
``` 