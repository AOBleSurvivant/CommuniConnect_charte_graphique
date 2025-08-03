import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CommuniConseil from '../../pages/CommuniConseil';
import communiconseilSlice from '../../store/slices/communiconseilSlice';

// Mock des composants enfants
jest.mock('../../components/CommuniConseil/CreatePublicationDialog', () => {
  return function MockCreatePublicationDialog({ open, onClose }) {
    return open ? <div data-testid="create-dialog">Create Dialog</div> : null;
  };
});

jest.mock('../../components/CommuniConseil/ContributorApplicationDialog', () => {
  return function MockContributorApplicationDialog({ open, onClose }) {
    return open ? <div data-testid="apply-dialog">Apply Dialog</div> : null;
  };
});

// Mock des actions Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn()
}));

describe('CommuniConseil', () => {
  const mockPublications = [
    {
      _id: '1',
      title: 'Comment obtenir un acte de naissance',
      category: 'Administration',
      description: 'Guide complet pour obtenir un acte de naissance...',
      author: 'Dr. Diallo',
      reactions: { thanks: 5, useful: 3 },
      createdAt: '2024-01-20T10:00:00Z'
    },
    {
      _id: '2',
      title: 'Conseils santé pour les enfants',
      category: 'Santé',
      description: 'Conseils pour maintenir la santé des enfants...',
      author: 'Dr. Camara',
      reactions: { thanks: 8, useful: 4 },
      createdAt: '2024-01-19T15:30:00Z'
    }
  ];

  const mockCategories = ['Santé', 'Droit', 'Administration', 'Sécurité'];

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useSelector pour les états
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return mockPublications;
      if (selector.name === 'selectCategories') return mockCategories;
      if (selector.name === 'selectSelectedCategory') return null;
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return null;
      if (selector.name === 'selectCommuniConseilSuccess') return null;
      return null;
    });
  });

  it('devrait rendre la page CommuniConseil', () => {
    render(<CommuniConseil />);
    
    expect(screen.getByText('CommuniConseil')).toBeInTheDocument();
    expect(screen.getByText('Partagez vos connaissances et conseils')).toBeInTheDocument();
  });

  it('devrait charger les publications et catégories au montage', () => {
    render(<CommuniConseil />);
    
    expect(mockDispatch).toHaveBeenCalledTimes(2);
    // Vérifier que les actions de chargement sont appelées
    expect(mockDispatch).toHaveBeenCalledWith(expect.any(Function));
  });

  it('devrait afficher les publications', () => {
    render(<CommuniConseil />);
    
    expect(screen.getByText('Comment obtenir un acte de naissance')).toBeInTheDocument();
    expect(screen.getByText('Conseils santé pour les enfants')).toBeInTheDocument();
    expect(screen.getByText('Dr. Diallo')).toBeInTheDocument();
    expect(screen.getByText('Dr. Camara')).toBeInTheDocument();
  });

  it('devrait afficher les catégories dans le filtre', () => {
    render(<CommuniConseil />);
    
    const filterButton = screen.getByLabelText('Filtrer par catégorie');
    fireEvent.click(filterButton);
    
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('devrait filtrer les publications par catégorie', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return mockPublications;
      if (selector.name === 'selectCategories') return mockCategories;
      if (selector.name === 'selectSelectedCategory') return 'Administration';
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return null;
      if (selector.name === 'selectCommuniConseilSuccess') return null;
      return null;
    });
    
    render(<CommuniConseil />);
    
    // Seule la publication de catégorie Administration devrait être visible
    expect(screen.getByText('Comment obtenir un acte de naissance')).toBeInTheDocument();
    expect(screen.queryByText('Conseils santé pour les enfants')).not.toBeInTheDocument();
  });

  it('devrait ouvrir le dialogue de création de publication', () => {
    render(<CommuniConseil />);
    
    const createButton = screen.getByText('Créer une publication');
    fireEvent.click(createButton);
    
    expect(screen.getByTestId('create-dialog')).toBeInTheDocument();
  });

  it('devrait ouvrir le dialogue de demande de contributeur', () => {
    render(<CommuniConseil />);
    
    const applyButton = screen.getByText('Devenir contributeur');
    fireEvent.click(applyButton);
    
    expect(screen.getByTestId('apply-dialog')).toBeInTheDocument();
  });

  it('devrait gérer les réactions aux publications', () => {
    render(<CommuniConseil />);
    
    const thanksButtons = screen.getAllByLabelText('Merci');
    fireEvent.click(thanksButtons[0]);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: { publicationId: '1', reaction: 'thanks' }
    }));
  });

  it('devrait gérer les signalements de publications', () => {
    render(<CommuniConseil />);
    
    const reportButtons = screen.getAllByLabelText('Signaler');
    fireEvent.click(reportButtons[0]);
    
    // Vérifier que le dialogue de signalement s'ouvre
    expect(screen.getByText('Signaler une publication')).toBeInTheDocument();
  });

  it('devrait afficher l\'état de chargement', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return [];
      if (selector.name === 'selectCategories') return [];
      if (selector.name === 'selectSelectedCategory') return null;
      if (selector.name === 'selectCommuniConseilLoading') return true;
      if (selector.name === 'selectCommuniConseilError') return null;
      if (selector.name === 'selectCommuniConseilSuccess') return null;
      return null;
    });
    
    render(<CommuniConseil />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('devrait afficher les erreurs', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return [];
      if (selector.name === 'selectCategories') return [];
      if (selector.name === 'selectSelectedCategory') return null;
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return 'Erreur de chargement';
      if (selector.name === 'selectCommuniConseilSuccess') return null;
      return null;
    });
    
    render(<CommuniConseil />);
    
    expect(screen.getByText('Erreur de chargement')).toBeInTheDocument();
  });

  it('devrait afficher les messages de succès', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return mockPublications;
      if (selector.name === 'selectCategories') return mockCategories;
      if (selector.name === 'selectSelectedCategory') return null;
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return null;
      if (selector.name === 'selectCommuniConseilSuccess') return 'Publication créée avec succès';
      return null;
    });
    
    render(<CommuniConseil />);
    
    expect(screen.getByText('Publication créée avec succès')).toBeInTheDocument();
  });

  it('devrait afficher les statistiques de réactions', () => {
    render(<CommuniConseil />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // thanks pour la première publication
    expect(screen.getByText('3')).toBeInTheDocument(); // useful pour la première publication
    expect(screen.getByText('8')).toBeInTheDocument(); // thanks pour la deuxième publication
    expect(screen.getByText('4')).toBeInTheDocument(); // useful pour la deuxième publication
  });

  it('devrait afficher les dates formatées', () => {
    render(<CommuniConseil />);
    
    // Vérifier que les dates sont affichées (format français)
    expect(screen.getByText(/20 janvier 2024/)).toBeInTheDocument();
    expect(screen.getByText(/19 janvier 2024/)).toBeInTheDocument();
  });

  it('devrait gérer le changement de catégorie', () => {
    render(<CommuniConseil />);
    
    const filterButton = screen.getByLabelText('Filtrer par catégorie');
    fireEvent.click(filterButton);
    
    const categoryOption = screen.getByText('Santé');
    fireEvent.click(categoryOption);
    
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      payload: 'Santé'
    }));
  });

  it('devrait afficher un message quand aucune publication', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectPublications') return [];
      if (selector.name === 'selectCategories') return mockCategories;
      if (selector.name === 'selectSelectedCategory') return null;
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return null;
      if (selector.name === 'selectCommuniConseilSuccess') return null;
      return null;
    });
    
    render(<CommuniConseil />);
    
    expect(screen.getByText('Aucune publication trouvée')).toBeInTheDocument();
  });
}); 