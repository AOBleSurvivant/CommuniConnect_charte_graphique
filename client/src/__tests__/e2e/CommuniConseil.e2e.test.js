import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import CommuniConseil from '../../pages/CommuniConseil';
import communiconseilSlice from '../../store/slices/communiconseilSlice';

// Mock des services pour simuler un environnement E2E
jest.mock('../../services/communiconseilService', () => ({
  getPublications: jest.fn(),
  getCategories: jest.fn(),
  createPublication: jest.fn(),
  applyForContributor: jest.fn(),
  reactToPublication: jest.fn(),
  reportPublication: jest.fn()
}));

describe('CommuniConseil E2E Tests', () => {
  let store;
  let communiconseilService;

  const createTestStore = (initialState = {}) => {
    return configureStore({
      reducer: {
        communiconseil: communiconseilSlice
      },
      preloadedState: {
        communiconseil: {
          publications: [],
          categories: [],
          selectedCategory: null,
          loading: false,
          error: null,
          success: null,
          ...initialState
        }
      }
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    communiconseilService = require('../../services/communiconseilService');
  });

  describe('Scénario complet de consultation', () => {
    it('devrait permettre à un utilisateur de consulter les publications', async () => {
      const mockPublications = [
        {
          _id: '1',
          title: 'Comment obtenir un acte de naissance',
          category: 'Administration',
          description: 'Guide complet pour obtenir un acte de naissance en Guinée...',
          author: 'Dr. Diallo',
          reactions: { thanks: 15, useful: 8 },
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Conseils santé pour les enfants',
          category: 'Santé',
          description: 'Conseils pratiques pour maintenir la santé des enfants...',
          author: 'Dr. Camara',
          reactions: { thanks: 12, useful: 6 },
          createdAt: '2024-01-19T15:30:00Z'
        }
      ];

      const mockCategories = ['Santé', 'Droit', 'Administration', 'Sécurité'];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(mockCategories);

      store = createTestStore({
        publications: mockPublications,
        categories: mockCategories
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier que les publications sont affichées
      await waitFor(() => {
        expect(screen.getByText('Comment obtenir un acte de naissance')).toBeInTheDocument();
        expect(screen.getByText('Conseils santé pour les enfants')).toBeInTheDocument();
      });

      // Vérifier les informations des publications
      expect(screen.getByText('Dr. Diallo')).toBeInTheDocument();
      expect(screen.getByText('Dr. Camara')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument(); // réactions thanks
      expect(screen.getByText('8')).toBeInTheDocument(); // réactions useful

      // Vérifier les catégories
      const filterButton = screen.getByLabelText('Filtrer par catégorie');
      fireEvent.click(filterButton);

      mockCategories.forEach(category => {
        expect(screen.getByText(category)).toBeInTheDocument();
      });
    });

    it('devrait permettre de filtrer les publications par catégorie', async () => {
      const mockPublications = [
        {
          _id: '1',
          title: 'Publication Santé',
          category: 'Santé',
          description: 'Description santé',
          author: 'Dr. Santé',
          reactions: { thanks: 5, useful: 3 },
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          _id: '2',
          title: 'Publication Administration',
          category: 'Administration',
          description: 'Description administration',
          author: 'Dr. Admin',
          reactions: { thanks: 3, useful: 2 },
          createdAt: '2024-01-19T10:00:00Z'
        }
      ];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(['Santé', 'Administration']);

      store = createTestStore({
        publications: mockPublications,
        categories: ['Santé', 'Administration']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier que toutes les publications sont visibles
      await waitFor(() => {
        expect(screen.getByText('Publication Santé')).toBeInTheDocument();
        expect(screen.getByText('Publication Administration')).toBeInTheDocument();
      });

      // Filtrer par catégorie Santé
      const filterButton = screen.getByLabelText('Filtrer par catégorie');
      fireEvent.click(filterButton);

      const santeOption = screen.getByText('Santé');
      fireEvent.click(santeOption);

      // Vérifier que seule la publication Santé est visible
      expect(screen.getByText('Publication Santé')).toBeInTheDocument();
      expect(screen.queryByText('Publication Administration')).not.toBeInTheDocument();
    });
  });

  describe('Scénario complet de création de publication', () => {
    it('devrait permettre à un contributeur de créer une publication', async () => {
      const user = userEvent.setup();

      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé', 'Droit']);
      communiconseilService.createPublication.mockResolvedValue({
        success: true,
        publication: {
          _id: '1',
          title: 'Nouvelle publication de test',
          category: 'Santé',
          description: 'Description de test suffisamment longue pour valider le formulaire',
          author: 'Dr. Test',
          createdAt: '2024-01-20T10:00:00Z'
        }
      });

      store = createTestStore({
        publications: [],
        categories: ['Santé', 'Droit']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Ouvrir le dialogue de création
      const createButton = screen.getByText('Créer une publication');
      await user.click(createButton);

      // Vérifier que le dialogue s'ouvre
      expect(screen.getByText('Créer une nouvelle publication')).toBeInTheDocument();

      // Remplir le formulaire
      const titleInput = screen.getByLabelText('Titre de la publication');
      const categorySelect = screen.getByLabelText('Catégorie');
      const descriptionInput = screen.getByLabelText('Description');

      await user.type(titleInput, 'Nouvelle publication de test');
      await user.click(categorySelect);
      await user.click(screen.getByText('Santé'));
      await user.type(descriptionInput, 'Description de test suffisamment longue pour valider le formulaire et permettre la création de la publication');

      // Vérifier que le bouton de soumission est activé
      const submitButton = screen.getByText('Créer la publication');
      expect(submitButton).toBeEnabled();

      // Soumettre le formulaire
      await user.click(submitButton);

      // Vérifier que l'API est appelée
      await waitFor(() => {
        expect(communiconseilService.createPublication).toHaveBeenCalledWith({
          title: 'Nouvelle publication de test',
          category: 'Santé',
          description: 'Description de test suffisamment longue pour valider le formulaire et permettre la création de la publication'
        });
      });
    });

    it('devrait valider les champs requis lors de la création', async () => {
      const user = userEvent.setup();

      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);

      store = createTestStore({
        publications: [],
        categories: ['Santé']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Ouvrir le dialogue de création
      const createButton = screen.getByText('Créer une publication');
      await user.click(createButton);

      // Vérifier que le bouton est désactivé initialement
      const submitButton = screen.getByText('Créer la publication');
      expect(submitButton).toBeDisabled();

      // Remplir partiellement le formulaire
      const titleInput = screen.getByLabelText('Titre de la publication');
      await user.type(titleInput, 'Titre court');

      // Vérifier que le bouton reste désactivé
      expect(submitButton).toBeDisabled();

      // Remplir correctement le formulaire
      await user.clear(titleInput);
      await user.type(titleInput, 'Titre de publication suffisamment long');
      
      const categorySelect = screen.getByLabelText('Catégorie');
      await user.click(categorySelect);
      await user.click(screen.getByText('Santé'));

      const descriptionInput = screen.getByLabelText('Description');
      await user.type(descriptionInput, 'Description suffisamment longue pour valider le formulaire et permettre la création de la publication');

      // Vérifier que le bouton est maintenant activé
      expect(submitButton).toBeEnabled();
    });
  });

  describe('Scénario complet de demande de contributeur', () => {
    it('devrait permettre à un utilisateur de devenir contributeur', async () => {
      const user = userEvent.setup();

      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);
      communiconseilService.applyForContributor.mockResolvedValue({
        success: true,
        message: 'Demande soumise avec succès',
        application: {
          _id: '1',
          name: 'Mamadou Diallo',
          region: 'Conakry',
          expertise: 'Administration publique',
          status: 'pending'
        }
      });

      store = createTestStore({
        publications: [],
        categories: ['Santé']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Ouvrir le dialogue de demande
      const applyButton = screen.getByText('Devenir contributeur');
      await user.click(applyButton);

      // Vérifier que le dialogue s'ouvre
      expect(screen.getByText('Devenir contributeur CommuniConseil')).toBeInTheDocument();

      // Remplir la première étape
      const nameInput = screen.getByLabelText('Nom complet');
      const regionSelect = screen.getByLabelText('Région');
      const emailInput = screen.getByLabelText('Email');

      await user.type(nameInput, 'Mamadou Diallo');
      await user.click(regionSelect);
      await user.click(screen.getByText('Conakry'));
      await user.type(emailInput, 'mamadou@exemple.com');

      // Aller à l'étape suivante
      const nextButton = screen.getByText('Suivant');
      await user.click(nextButton);

      // Remplir l'étape d'expertise
      const expertiseSelect = screen.getByLabelText('Domaine d\'expertise');
      await user.click(expertiseSelect);
      await user.click(screen.getByText('Administration publique'));

      // Aller à l'étape de validation
      const nextButton2 = screen.getByText('Suivant');
      await user.click(nextButton2);

      // Vérifier les informations de validation
      expect(screen.getByText('Nom: Mamadou Diallo')).toBeInTheDocument();
      expect(screen.getByText('Région: Conakry')).toBeInTheDocument();
      expect(screen.getByText('Domaine: Administration publique')).toBeInTheDocument();

      // Soumettre la demande
      const submitButton = screen.getByText('Soumettre la demande');
      await user.click(submitButton);

      // Vérifier que l'API est appelée
      await waitFor(() => {
        expect(communiconseilService.applyForContributor).toHaveBeenCalledWith({
          name: 'Mamadou Diallo',
          region: 'Conakry',
          expertise: 'Administration publique',
          phone: '',
          email: 'mamadou@exemple.com'
        });
      });
    });
  });

  describe('Scénario complet d\'interaction avec les publications', () => {
    it('devrait permettre de réagir et signaler les publications', async () => {
      const user = userEvent.setup();

      const mockPublications = [
        {
          _id: '1',
          title: 'Publication de test',
          category: 'Santé',
          description: 'Description de test',
          author: 'Dr. Test',
          reactions: { thanks: 5, useful: 3 },
          createdAt: '2024-01-20T10:00:00Z'
        }
      ];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);
      communiconseilService.reactToPublication.mockResolvedValue({
        success: true,
        reactions: { thanks: 6, useful: 3 }
      });
      communiconseilService.reportPublication.mockResolvedValue({
        success: true,
        message: 'Signalement enregistré'
      });

      store = createTestStore({
        publications: mockPublications,
        categories: ['Santé']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier que la publication est affichée
      await waitFor(() => {
        expect(screen.getByText('Publication de test')).toBeInTheDocument();
      });

      // Réagir à la publication
      const thanksButton = screen.getByLabelText('Merci');
      await user.click(thanksButton);

      // Vérifier que l'API de réaction est appelée
      await waitFor(() => {
        expect(communiconseilService.reactToPublication).toHaveBeenCalledWith('1', 'thanks');
      });

      // Signaler la publication
      const reportButton = screen.getByLabelText('Signaler');
      await user.click(reportButton);

      // Vérifier que le dialogue de signalement s'ouvre
      expect(screen.getByText('Signaler une publication')).toBeInTheDocument();

      // Remplir le formulaire de signalement
      const reasonInput = screen.getByLabelText('Raison du signalement');
      await user.type(reasonInput, 'Information incorrecte');

      // Soumettre le signalement
      const submitReportButton = screen.getByText('Signaler');
      await user.click(submitReportButton);

      // Vérifier que l'API de signalement est appelée
      await waitFor(() => {
        expect(communiconseilService.reportPublication).toHaveBeenCalledWith('1', 'Information incorrecte');
      });
    });
  });

  describe('Scénario de gestion des erreurs', () => {
    it('devrait gérer les erreurs de chargement', async () => {
      const error = new Error('Erreur de connexion');
      communiconseilService.getPublications.mockRejectedValue(error);
      communiconseilService.getCategories.mockRejectedValue(error);

      store = createTestStore({
        publications: [],
        categories: [],
        error: 'Erreur de chargement des données'
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier que l'erreur est affichée
      expect(screen.getByText('Erreur de chargement des données')).toBeInTheDocument();

      // Vérifier que le message d'erreur disparaît après 5 secondes
      await waitFor(() => {
        expect(screen.queryByText('Erreur de chargement des données')).not.toBeInTheDocument();
      }, { timeout: 6000 });
    });

    it('devrait afficher un message quand aucune publication', async () => {
      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);

      store = createTestStore({
        publications: [],
        categories: ['Santé']
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier le message d'absence de publications
      expect(screen.getByText('Aucune publication trouvée')).toBeInTheDocument();
    });
  });
}); 