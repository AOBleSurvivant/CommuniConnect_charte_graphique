import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import CommuniConseil from '../../pages/CommuniConseil';
import communiconseilSlice from '../../store/slices/communiconseilSlice';
import communiconseilService from '../../services/communiconseilService';

// Mock du service
jest.mock('../../services/communiconseilService');

// Mock des composants enfants
jest.mock('../../components/CommuniConseil/CreatePublicationDialog', () => {
  return function MockCreatePublicationDialog({ open, onClose, categories }) {
    if (!open) return null;
    
    return (
      <div data-testid="create-dialog">
        <h2>Créer une publication</h2>
        <input data-testid="title-input" placeholder="Titre" />
        <select data-testid="category-select">
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <textarea data-testid="description-input" placeholder="Description" />
        <button data-testid="submit-publication" onClick={onClose}>
          Créer
        </button>
        <button data-testid="cancel-publication" onClick={onClose}>
          Annuler
        </button>
      </div>
    );
  };
});

jest.mock('../../components/CommuniConseil/ContributorApplicationDialog', () => {
  return function MockContributorApplicationDialog({ open, onClose }) {
    if (!open) return null;
    
    return (
      <div data-testid="apply-dialog">
        <h2>Devenir contributeur</h2>
        <input data-testid="name-input" placeholder="Nom complet" />
        <select data-testid="region-select">
          <option value="Conakry">Conakry</option>
          <option value="Kankan">Kankan</option>
        </select>
        <select data-testid="expertise-select">
          <option value="Administration publique">Administration publique</option>
          <option value="Médecine générale">Médecine générale</option>
        </select>
        <button data-testid="submit-application" onClick={onClose}>
          Soumettre
        </button>
        <button data-testid="cancel-application" onClick={onClose}>
          Annuler
        </button>
      </div>
    );
  };
});

describe('CommuniConseil Integration Tests', () => {
  let store;

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
  });

  describe('Chargement initial', () => {
    it('devrait charger les publications et catégories au montage', async () => {
      const mockPublications = [
        {
          _id: '1',
          title: 'Test Publication',
          category: 'Santé',
          description: 'Description test',
          author: 'Dr. Test',
          reactions: { thanks: 5, useful: 3 },
          createdAt: '2024-01-20T10:00:00Z'
        }
      ];

      const mockCategories = ['Santé', 'Droit', 'Administration'];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(mockCategories);

      store = createTestStore();

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(communiconseilService.getPublications).toHaveBeenCalled();
        expect(communiconseilService.getCategories).toHaveBeenCalled();
      });
    });

    it('devrait gérer les erreurs de chargement', async () => {
      const error = new Error('Erreur réseau');
      communiconseilService.getPublications.mockRejectedValue(error);
      communiconseilService.getCategories.mockRejectedValue(error);

      store = createTestStore();

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        expect(communiconseilService.getPublications).toHaveBeenCalled();
        expect(communiconseilService.getCategories).toHaveBeenCalled();
      });
    });
  });

  describe('Interaction avec les publications', () => {
    beforeEach(() => {
      const mockPublications = [
        {
          _id: '1',
          title: 'Test Publication',
          category: 'Santé',
          description: 'Description test',
          author: 'Dr. Test',
          reactions: { thanks: 5, useful: 3 },
          createdAt: '2024-01-20T10:00:00Z'
        }
      ];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);

      store = createTestStore({
        publications: mockPublications,
        categories: ['Santé']
      });
    });

    it('devrait permettre de réagir aux publications', async () => {
      communiconseilService.reactToPublication.mockResolvedValue({
        success: true,
        reactions: { thanks: 6, useful: 3 }
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        const thanksButton = screen.getByLabelText('Merci');
        fireEvent.click(thanksButton);
      });

      await waitFor(() => {
        expect(communiconseilService.reactToPublication).toHaveBeenCalledWith('1', 'thanks');
      });
    });

    it('devrait permettre de signaler une publication', async () => {
      communiconseilService.reportPublication.mockResolvedValue({
        success: true,
        message: 'Signalement enregistré'
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      await waitFor(() => {
        const reportButton = screen.getByLabelText('Signaler');
        fireEvent.click(reportButton);
      });

      // Vérifier que le dialogue de signalement s'ouvre
      expect(screen.getByText('Signaler une publication')).toBeInTheDocument();
    });
  });

  describe('Création de publication', () => {
    beforeEach(() => {
      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé', 'Droit']);

      store = createTestStore({
        publications: [],
        categories: ['Santé', 'Droit']
      });
    });

    it('devrait ouvrir le dialogue de création', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      const createButton = screen.getByText('Créer une publication');
      fireEvent.click(createButton);

      expect(screen.getByTestId('create-dialog')).toBeInTheDocument();
    });

    it('devrait permettre de créer une publication', async () => {
      communiconseilService.createPublication.mockResolvedValue({
        success: true,
        publication: {
          _id: '1',
          title: 'Nouvelle publication',
          category: 'Santé',
          description: 'Description test',
          author: 'Dr. Test',
          createdAt: '2024-01-20T10:00:00Z'
        }
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Ouvrir le dialogue
      const createButton = screen.getByText('Créer une publication');
      fireEvent.click(createButton);

      // Remplir le formulaire
      const titleInput = screen.getByTestId('title-input');
      const categorySelect = screen.getByTestId('category-select');
      const descriptionInput = screen.getByTestId('description-input');

      fireEvent.change(titleInput, { target: { value: 'Nouvelle publication' } });
      fireEvent.change(categorySelect, { target: { value: 'Santé' } });
      fireEvent.change(descriptionInput, { target: { value: 'Description de test suffisamment longue' } });

      // Soumettre
      const submitButton = screen.getByTestId('submit-publication');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(communiconseilService.createPublication).toHaveBeenCalledWith({
          title: 'Nouvelle publication',
          category: 'Santé',
          description: 'Description de test suffisamment longue'
        });
      });
    });
  });

  describe('Demande de contributeur', () => {
    beforeEach(() => {
      communiconseilService.getPublications.mockResolvedValue([]);
      communiconseilService.getCategories.mockResolvedValue(['Santé']);

      store = createTestStore({
        publications: [],
        categories: ['Santé']
      });
    });

    it('devrait ouvrir le dialogue de demande', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      const applyButton = screen.getByText('Devenir contributeur');
      fireEvent.click(applyButton);

      expect(screen.getByTestId('apply-dialog')).toBeInTheDocument();
    });

    it('devrait permettre de soumettre une demande', async () => {
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

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Ouvrir le dialogue
      const applyButton = screen.getByText('Devenir contributeur');
      fireEvent.click(applyButton);

      // Remplir le formulaire
      const nameInput = screen.getByTestId('name-input');
      const regionSelect = screen.getByTestId('region-select');
      const expertiseSelect = screen.getByTestId('expertise-select');

      fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
      fireEvent.change(regionSelect, { target: { value: 'Conakry' } });
      fireEvent.change(expertiseSelect, { target: { value: 'Administration publique' } });

      // Soumettre
      const submitButton = screen.getByTestId('submit-application');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(communiconseilService.applyForContributor).toHaveBeenCalledWith({
          name: 'Mamadou Diallo',
          region: 'Conakry',
          expertise: 'Administration publique'
        });
      });
    });
  });

  describe('Filtrage et navigation', () => {
    beforeEach(() => {
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
          title: 'Publication Droit',
          category: 'Droit',
          description: 'Description droit',
          author: 'Dr. Droit',
          reactions: { thanks: 3, useful: 2 },
          createdAt: '2024-01-19T10:00:00Z'
        }
      ];

      communiconseilService.getPublications.mockResolvedValue(mockPublications);
      communiconseilService.getCategories.mockResolvedValue(['Santé', 'Droit']);

      store = createTestStore({
        publications: mockPublications,
        categories: ['Santé', 'Droit']
      });
    });

    it('devrait filtrer les publications par catégorie', async () => {
      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      // Vérifier que toutes les publications sont visibles
      expect(screen.getByText('Publication Santé')).toBeInTheDocument();
      expect(screen.getByText('Publication Droit')).toBeInTheDocument();

      // Filtrer par catégorie Santé
      const filterButton = screen.getByLabelText('Filtrer par catégorie');
      fireEvent.click(filterButton);

      const santeOption = screen.getByText('Santé');
      fireEvent.click(santeOption);

      // Vérifier que seule la publication Santé est visible
      expect(screen.getByText('Publication Santé')).toBeInTheDocument();
      expect(screen.queryByText('Publication Droit')).not.toBeInTheDocument();
    });
  });

  describe('Gestion des erreurs', () => {
    it('devrait afficher les erreurs de chargement', async () => {
      const error = new Error('Erreur de connexion');
      communiconseilService.getPublications.mockRejectedValue(error);
      communiconseilService.getCategories.mockRejectedValue(error);

      store = createTestStore({
        publications: [],
        categories: [],
        error: 'Erreur de chargement'
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
    });

    it('devrait afficher les messages de succès', async () => {
      store = createTestStore({
        publications: [],
        categories: [],
        success: 'Publication créée avec succès'
      });

      render(
        <Provider store={store}>
          <BrowserRouter>
            <CommuniConseil />
          </BrowserRouter>
        </Provider>
      );

      expect(screen.getByText('Publication créée avec succès')).toBeInTheDocument();
    });
  });
}); 