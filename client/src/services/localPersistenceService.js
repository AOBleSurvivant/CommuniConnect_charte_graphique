// Service de persistance locale pour sauvegarder les données temporaires
// en attendant le déploiement de la base de données

class LocalPersistenceService {
  constructor() {
    this.storage = window.localStorage;
    this.prefix = 'communiconnect_temp_';
    this.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 jours par défaut
  }

  // Initialiser le service
  init() {
    console.log('🔄 Service de persistance locale initialisé');
    this.cleanup();
  }

  // Sauvegarder des données avec expiration
  save(type, data, id = null, maxAge = this.maxAge) {
    try {
      const key = `${this.prefix}${type}_${id || Date.now()}`;
      const item = {
        data,
        type,
        id,
        createdAt: Date.now(),
        expiresAt: Date.now() + maxAge
      };

      this.storage.setItem(key, JSON.stringify(item));
      console.log(`💾 Données sauvegardées: ${type}`);
      return key;
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      return null;
    }
  }

  // Récupérer des données
  load(type, id = null) {
    try {
      const keys = Object.keys(this.storage);
      const key = keys.find(k => 
        k.startsWith(this.prefix) && 
        k.includes(type) && 
        (id ? k.includes(id) : true)
      );

      if (key) {
        const item = JSON.parse(this.storage.getItem(key));
        if (item && Date.now() < item.expiresAt) {
          console.log(`📂 Données récupérées: ${type}`);
          return item.data;
        } else {
          this.storage.removeItem(key);
        }
      }

      return null;
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      return null;
    }
  }

  // Charger toutes les données d'un type
  loadAll(type) {
    try {
      const results = [];
      const keys = Object.keys(this.storage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix) && key.includes(type)) {
          try {
            const item = JSON.parse(this.storage.getItem(key));
            if (item && Date.now() < item.expiresAt) {
              results.push(item.data);
            } else {
              this.storage.removeItem(key);
            }
          } catch {
            this.storage.removeItem(key);
          }
        }
      });

      return results;
    } catch (error) {
      console.error('❌ Erreur lors du chargement multiple:', error);
      return [];
    }
  }

  // Mettre à jour des données existantes
  update(type, data, id) {
    try {
      const keys = Object.keys(this.storage);
      const key = keys.find(k => 
        k.startsWith(this.prefix) && 
        k.includes(type) && 
        k.includes(id)
      );

      if (key) {
        const item = JSON.parse(this.storage.getItem(key));
        if (item) {
          const updatedItem = {
            ...item,
            data: { ...item.data, ...data },
            updatedAt: Date.now()
          };

          this.storage.setItem(key, JSON.stringify(updatedItem));
          console.log(`🔄 Données mises à jour: ${type}`);
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', error);
      return false;
    }
  }

  // Supprimer des données
  remove(type, id = null) {
    try {
      const keys = Object.keys(this.storage);
      const keysToRemove = keys.filter(key => 
        key.startsWith(this.prefix) && 
        key.includes(type) && 
        (id ? key.includes(id) : true)
      );

      keysToRemove.forEach(key => {
        this.storage.removeItem(key);
      });

      console.log(`🗑️ Données supprimées: ${type}`, keysToRemove.length);
      return keysToRemove.length;
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      return 0;
    }
  }

  // Nettoyer les données expirées
  cleanup() {
    try {
      let cleanedCount = 0;
      const keys = Object.keys(this.storage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const item = JSON.parse(this.storage.getItem(key));
            if (item && Date.now() >= item.expiresAt) {
              this.storage.removeItem(key);
              cleanedCount++;
            }
          } catch {
            this.storage.removeItem(key);
            cleanedCount++;
          }
        }
      });

      if (cleanedCount > 0) {
        console.log(`🧹 Nettoyage terminé: ${cleanedCount} éléments supprimés`);
      }

      return cleanedCount;
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage:', error);
      return 0;
    }
  }

  // Méthodes spécialisées pour les types de données courants

  // Sauvegarder un profil utilisateur
  saveProfile(profileData) {
    return this.save('profile', profileData, profileData._id || profileData.id, 30 * 24 * 60 * 60 * 1000); // 30 jours
  }

  // Charger un profil utilisateur
  loadProfile(userId) {
    return this.load('profile', userId);
  }

  // Sauvegarder une photo de profil avec gestion des médias
  saveProfilePicture(userId, pictureData) {
    try {
      // Convertir l'image en base64 si c'est un fichier
      const processedData = this.processImageData(pictureData);
      return this.save('profile_picture', processedData, userId, 30 * 24 * 60 * 60 * 1000); // 30 jours
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la photo de profil:', error);
      return null;
    }
  }

  // Charger une photo de profil
  loadProfilePicture(userId) {
    return this.load('profile_picture', userId);
  }

  // Traiter les données d'image pour la persistance
  processImageData(imageData) {
    if (typeof imageData === 'string') {
      // Si c'est déjà une URL ou base64
      return imageData;
    }
    
    if (imageData instanceof File) {
      // Convertir le fichier en base64
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(imageData);
      });
    }
    
    return imageData;
  }

  // Sauvegarder une publication avec gestion des médias
  savePost(postData) {
    try {
      // Traiter les médias de la publication
      const processedData = {
        ...postData,
        media: postData.media ? this.processImageData(postData.media) : null
      };
      
      return this.save('post', processedData, postData._id || postData.id, 7 * 24 * 60 * 60 * 1000); // 7 jours
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la publication:', error);
      return null;
    }
  }

  // Charger une publication
  loadPost(postId) {
    return this.load('post', postId);
  }

  // Charger toutes les publications
  loadAllPosts() {
    return this.loadAll('post');
  }

  // Sauvegarder un événement
  saveEvent(eventData) {
    return this.save('event', eventData, eventData._id || eventData.id, 7 * 24 * 60 * 60 * 1000); // 7 jours
  }

  // Charger un événement
  loadEvent(eventId) {
    return this.load('event', eventId);
  }

  // Charger tous les événements
  loadAllEvents() {
    return this.loadAll('event');
  }

  // Sauvegarder un message
  saveMessage(messageData) {
    return this.save('message', messageData, messageData._id || messageData.id, 3 * 24 * 60 * 60 * 1000); // 3 jours
  }

  // Charger tous les messages d'une conversation
  loadConversationMessages(conversationId) {
    return this.loadAll('message').filter(msg => msg.conversationId === conversationId);
  }

  // Sauvegarder des paramètres utilisateur
  saveUserSettings(userId, settings) {
    return this.save('user_settings', settings, userId, 365 * 24 * 60 * 60 * 1000); // 1 an
  }

  // Charger des paramètres utilisateur
  loadUserSettings(userId) {
    return this.load('user_settings', userId);
  }

  // Exporter toutes les données (pour sauvegarde)
  exportAllData() {
    try {
      const data = {};
      const keys = Object.keys(this.storage);
      
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          try {
            const item = JSON.parse(this.storage.getItem(key));
            if (item && Date.now() < item.expiresAt) {
              if (!data[item.type]) {
                data[item.type] = [];
              }
              data[item.type].push(item.data);
            }
          } catch {
            // Ignorer les éléments corrompus
          }
        }
      });

      return data;
    } catch (error) {
      console.error('❌ Erreur lors de l\'export:', error);
      return {};
    }
  }

  // Importer des données (pour restauration)
  importData(data) {
    try {
      let importedCount = 0;
      
      Object.entries(data).forEach(([type, items]) => {
        items.forEach(item => {
          const id = item._id || item.id || Date.now();
          if (this.save(type, item, id)) {
            importedCount++;
          }
        });
      });

      console.log(`📥 Données importées: ${importedCount} éléments`);
      return importedCount;
    } catch (error) {
      console.error('❌ Erreur lors de l\'import:', error);
      return 0;
    }
  }

  // Obtenir les statistiques de stockage
  getStats() {
    try {
      const keys = Object.keys(this.storage).filter(key => key.startsWith(this.prefix));
      
      const stats = {
        totalItems: keys.length,
        totalSize: 0,
        byType: {}
      };

      keys.forEach(key => {
        try {
          const item = JSON.parse(this.storage.getItem(key));
          if (item) {
            const itemSize = JSON.stringify(item).length;
            stats.totalSize += itemSize;
            
            if (!stats.byType[item.type]) {
              stats.byType[item.type] = { count: 0, size: 0 };
            }
            stats.byType[item.type].count++;
            stats.byType[item.type].size += itemSize;
          }
        } catch {
          // Ignorer les éléments corrompus
        }
      });

      return stats;
    } catch (error) {
      console.error('❌ Erreur lors du calcul des statistiques:', error);
      return { totalItems: 0, totalSize: 0, byType: {} };
    }
  }
}

// Créer une instance singleton
const localPersistenceService = new LocalPersistenceService();

export default localPersistenceService; 