import api from './api';
import localPersistenceService from './localPersistenceService';

class CommuniConseilService {
  constructor() {
    this.testDataAdded = false;
  }

  // Ajouter des données de test pour CommuniConseil
  addTestData() {
    if (this.testDataAdded) {
      console.log('📝 Données de test déjà ajoutées');
      return;
    }

    const testPublications = [
      {
        _id: 'test_1',
        title: 'Comment obtenir un acte de naissance rapidement',
        category: 'Administration',
        description: 'Voici les étapes pour obtenir votre acte de naissance en moins de 48h. Rendez-vous à la mairie avec votre pièce d\'identité et remplissez le formulaire. Le délai est généralement de 24-48h.',
        author: {
          _id: 'contrib-1',
          name: 'Mamadou Diallo',
          region: 'Conakry',
          expertise: 'Administration publique',
          verified: true,
          reliabilityScore: 95
        },
        reactions: { thanks: 12, useful: 8 },
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        _id: 'test_2',
        title: 'Conseils pour un jardin potager en saison sèche',
        category: 'Agriculture',
        description: 'Pendant la saison sèche, privilégiez les cultures résistantes comme le manioc, l\'igname et les légumes-feuilles. Arrosez tôt le matin ou tard le soir pour économiser l\'eau.',
        author: {
          _id: 'contrib-2',
          name: 'Fatoumata Camara',
          region: 'Kankan',
          expertise: 'Agriculture durable',
          verified: true,
          reliabilityScore: 92
        },
        reactions: { thanks: 15, useful: 12 },
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        _id: 'test_3',
        title: 'Droits des locataires en Guinée',
        category: 'Droit',
        description: 'Les locataires ont des droits protégés par la loi. Le propriétaire ne peut pas vous expulser sans préavis de 3 mois. Conservez toujours vos quittances de loyer.',
        author: {
          _id: 'contrib-3',
          name: 'Ibrahima Bah',
          region: 'Conakry',
          expertise: 'Droit civil',
          verified: true,
          reliabilityScore: 88
        },
        reactions: { thanks: 8, useful: 6 },
        createdAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    // Sauvegarder les données de test
    localPersistenceService.save('communiconseil_publications', testPublications);
    this.testDataAdded = true;
    console.log('📝 Données de test pour CommuniConseil ajoutées');
  }

  // Récupérer toutes les publications
  async getPublications() {
    try {
      const response = await api.get('/api/communiconseil');
      return response.data;
    } catch (error) {
      console.log('📂 Tentative de récupération depuis le stockage local');
      // Fallback vers les données locales
      const localPublications = localPersistenceService.load('communiconseil_publications');
      if (localPublications) {
        return { 
          success: true, 
          publications: localPublications, 
          total: localPublications.length 
        };
      }
      return { success: true, publications: [], total: 0 };
    }
  }

  // Récupérer les catégories
  async getCategories() {
    try {
      const response = await api.get('/api/communiconseil/categories');
      return response.data;
    } catch (error) {
      console.log('📂 Utilisation des catégories par défaut');
      // Catégories par défaut
      return {
        success: true,
        categories: [
          'Santé', 'Droit', 'Administration', 'Agriculture', 'Sécurité',
          'Éducation', 'Transport', 'Commerce', 'Environnement', 'Technologie'
        ]
      };
    }
  }

  // Demande pour devenir contributeur
  async applyAsContributor(applicationData) {
    try {
      const response = await api.post('/api/communiconseil/contributor/apply', applicationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la demande de contributeur:', error);
      throw error;
    }
  }

  // Créer une publication
  async createPublication(publicationData) {
    try {
      const response = await api.post('/api/communiconseil/publications', publicationData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la publication:', error);
      throw error;
    }
  }

  // Réagir à une publication
  async reactToPublication(publicationId, reaction) {
    try {
      const response = await api.post(`/api/communiconseil/publications/${publicationId}/react`, {
        reaction
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la réaction:', error);
      throw error;
    }
  }

  // Signaler une publication
  async reportPublication(publicationId, reason) {
    try {
      const response = await api.post(`/api/communiconseil/publications/${publicationId}/report`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      throw error;
    }
  }
}

export default new CommuniConseilService(); 