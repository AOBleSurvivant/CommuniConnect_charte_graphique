import communiconseilService from '../../services/communiconseilService';
import api from '../../services/api';

// Mock de l'API
jest.mock('../../services/api');

describe('CommuniConseilService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublications', () => {
    it('devrait récupérer les publications avec succès', async () => {
      const mockPublications = [
        {
          _id: '1',
          title: 'Comment obtenir un acte de naissance',
          category: 'Administration',
          description: 'Guide complet...',
          author: 'Dr. Diallo',
          reactions: { thanks: 5, useful: 3 },
          createdAt: '2024-01-20T10:00:00Z'
        }
      ];

      api.get.mockResolvedValue({ data: mockPublications });

      const result = await communiconseilService.getPublications();

      expect(api.get).toHaveBeenCalledWith('/communiconseil');
      expect(result).toEqual(mockPublications);
    });

    it('devrait gérer les erreurs lors de la récupération des publications', async () => {
      const error = new Error('Erreur réseau');
      api.get.mockRejectedValue(error);

      await expect(communiconseilService.getPublications()).rejects.toThrow('Erreur réseau');
      expect(api.get).toHaveBeenCalledWith('/communiconseil');
    });
  });

  describe('getCategories', () => {
    it('devrait récupérer les catégories avec succès', async () => {
      const mockCategories = ['Santé', 'Droit', 'Administration', 'Sécurité'];
      api.get.mockResolvedValue({ data: mockCategories });

      const result = await communiconseilService.getCategories();

      expect(api.get).toHaveBeenCalledWith('/communiconseil/categories');
      expect(result).toEqual(mockCategories);
    });

    it('devrait gérer les erreurs lors de la récupération des catégories', async () => {
      const error = new Error('Erreur serveur');
      api.get.mockRejectedValue(error);

      await expect(communiconseilService.getCategories()).rejects.toThrow('Erreur serveur');
    });
  });

  describe('applyForContributor', () => {
    it('devrait soumettre une demande de contributeur avec succès', async () => {
      const applicationData = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        phone: '22412345678',
        email: 'mamadou@exemple.com'
      };

      const mockResponse = {
        success: true,
        message: 'Demande soumise avec succès',
        application: { _id: '1', ...applicationData, status: 'pending' }
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await communiconseilService.applyForContributor(applicationData);

      expect(api.post).toHaveBeenCalledWith('/communiconseil/contributor/apply', applicationData);
      expect(result).toEqual(mockResponse);
    });

    it('devrait gérer les erreurs lors de la soumission de la demande', async () => {
      const applicationData = { name: 'Test' };
      const error = new Error('Données invalides');
      api.post.mockRejectedValue(error);

      await expect(communiconseilService.applyForContributor(applicationData)).rejects.toThrow('Données invalides');
    });
  });

  describe('createPublication', () => {
    it('devrait créer une publication avec succès', async () => {
      const publicationData = {
        title: 'Guide santé',
        category: 'Santé',
        description: 'Conseils pour rester en bonne santé...'
      };

      const mockResponse = {
        success: true,
        publication: {
          _id: '1',
          ...publicationData,
          author: 'Dr. Diallo',
          createdAt: '2024-01-20T10:00:00Z'
        }
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await communiconseilService.createPublication(publicationData);

      expect(api.post).toHaveBeenCalledWith('/communiconseil/publications', publicationData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reactToPublication', () => {
    it('devrait réagir à une publication avec succès', async () => {
      const publicationId = '1';
      const reaction = 'thanks';

      const mockResponse = {
        success: true,
        message: 'Réaction enregistrée',
        reactions: { thanks: 6, useful: 3 }
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await communiconseilService.reactToPublication(publicationId, reaction);

      expect(api.post).toHaveBeenCalledWith(`/communiconseil/publications/${publicationId}/react`, { reaction });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('reportPublication', () => {
    it('devrait signaler une publication avec succès', async () => {
      const publicationId = '1';
      const reason = 'Information incorrecte';

      const mockResponse = {
        success: true,
        message: 'Signalement enregistré'
      };

      api.post.mockResolvedValue({ data: mockResponse });

      const result = await communiconseilService.reportPublication(publicationId, reason);

      expect(api.post).toHaveBeenCalledWith(`/communiconseil/publications/${publicationId}/report`, { reason });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('formatPublication', () => {
    it('devrait formater une publication correctement', () => {
      const rawPublication = {
        _id: '1',
        title: 'Test Publication',
        category: 'Santé',
        description: 'Description test',
        author: 'Dr. Test',
        media: 'image.jpg',
        reactions: { thanks: 5, useful: 3 },
        comments: [{ id: '1', text: 'Commentaire test' }],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      };

      const formatted = communiconseilService.formatPublication(rawPublication);

      expect(formatted).toEqual({
        id: '1',
        title: 'Test Publication',
        category: 'Santé',
        description: 'Description test',
        author: 'Dr. Test',
        media: 'image.jpg',
        reactions: { thanks: 5, useful: 3 },
        comments: [{ id: '1', text: 'Commentaire test' }],
        createdAt: '2024-01-20T10:00:00Z',
        updatedAt: '2024-01-20T10:00:00Z'
      });
    });
  });

  describe('formatContributorApplication', () => {
    it('devrait formater une demande de contributeur correctement', () => {
      const rawApplication = {
        _id: '1',
        userId: 'user123',
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        phone: '22412345678',
        email: 'mamadou@exemple.com',
        status: 'pending',
        createdAt: '2024-01-20T10:00:00Z'
      };

      const formatted = communiconseilService.formatContributorApplication(rawApplication);

      expect(formatted).toEqual({
        id: '1',
        userId: 'user123',
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        phone: '22412345678',
        email: 'mamadou@exemple.com',
        status: 'pending',
        createdAt: '2024-01-20T10:00:00Z'
      });
    });
  });
}); 