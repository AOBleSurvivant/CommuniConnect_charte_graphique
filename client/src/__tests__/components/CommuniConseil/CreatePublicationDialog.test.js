import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CreatePublicationDialog from '../../../components/CommuniConseil/CreatePublicationDialog';

// Mock des actions Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn()
}));

describe('CreatePublicationDialog', () => {
  const mockOnClose = jest.fn();
  const mockCategories = ['Santé', 'Droit', 'Administration', 'Sécurité'];
  
  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    categories: mockCategories
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock useSelector pour les états
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return null;
      return null;
    });
  });

  it('devrait rendre le dialogue de création de publication', () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Créer une nouvelle publication')).toBeInTheDocument();
    expect(screen.getByLabelText('Titre de la publication')).toBeInTheDocument();
    expect(screen.getByLabelText('Catégorie')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('devrait afficher les catégories dans le select', () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    const categorySelect = screen.getByLabelText('Catégorie');
    fireEvent.mouseDown(categorySelect);
    
    mockCategories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  it('devrait valider les champs requis', () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    const submitButton = screen.getByText('Créer la publication');
    expect(submitButton).toBeDisabled();
    
    // Remplir le titre (trop court)
    const titleInput = screen.getByLabelText('Titre de la publication');
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    expect(submitButton).toBeDisabled();
    
    // Remplir le titre correctement
    fireEvent.change(titleInput, { target: { value: 'Titre de publication suffisamment long' } });
    expect(submitButton).toBeDisabled();
    
    // Sélectionner une catégorie
    const categorySelect = screen.getByLabelText('Catégorie');
    fireEvent.mouseDown(categorySelect);
    fireEvent.click(screen.getByText('Santé'));
    
    // Remplir la description (trop courte)
    const descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(descriptionInput, { target: { value: 'Description courte' } });
    expect(submitButton).toBeDisabled();
    
    // Remplir la description correctement
    fireEvent.change(descriptionInput, { 
      target: { value: 'Description suffisamment longue pour valider le formulaire et permettre la création de la publication' } 
    });
    expect(submitButton).toBeEnabled();
  });

  it('devrait afficher les messages d\'aide pour la validation', () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    const titleInput = screen.getByLabelText('Titre de la publication');
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    expect(screen.getByText('4/200 caractères (minimum 10)')).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
    
    fireEvent.change(titleInput, { target: { value: 'Titre correct' } });
    expect(screen.getByText('16/200 caractères (minimum 10)')).toBeInTheDocument();
    expect(titleInput).not.toHaveAttribute('aria-invalid');
  });

  it('devrait gérer la soumission du formulaire', async () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    // Remplir le formulaire
    const titleInput = screen.getByLabelText('Titre de la publication');
    const categorySelect = screen.getByLabelText('Catégorie');
    const descriptionInput = screen.getByLabelText('Description');
    
    fireEvent.change(titleInput, { target: { value: 'Titre de publication test' } });
    fireEvent.mouseDown(categorySelect);
    fireEvent.click(screen.getByText('Santé'));
    fireEvent.change(descriptionInput, { 
      target: { value: 'Description de test suffisamment longue pour valider le formulaire' } 
    });
    
    const submitButton = screen.getByText('Créer la publication');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

  it('devrait afficher l\'état de chargement', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectCommuniConseilLoading') return true;
      if (selector.name === 'selectCommuniConseilError') return null;
      return null;
    });
    
    render(<CreatePublicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Création...')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeDisabled();
  });

  it('devrait afficher les erreurs', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return 'Erreur de création';
      return null;
    });
    
    render(<CreatePublicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Erreur de création')).toBeInTheDocument();
  });

  it('devrait réinitialiser le formulaire à la fermeture', () => {
    render(<CreatePublicationDialog {...defaultProps} />);
    
    const titleInput = screen.getByLabelText('Titre de la publication');
    const descriptionInput = screen.getByLabelText('Description');
    
    fireEvent.change(titleInput, { target: { value: 'Test titre' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    
    expect(titleInput).toHaveValue('');
    expect(descriptionInput).toHaveValue('');
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 