import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ContributorApplicationDialog from '../../../components/CommuniConseil/ContributorApplicationDialog';

// Mock des actions Redux
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: jest.fn()
}));

describe('ContributorApplicationDialog', () => {
  const mockOnClose = jest.fn();
  
  const defaultProps = {
    open: true,
    onClose: mockOnClose
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

  it('devrait rendre le dialogue de demande de contributeur', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Devenir contributeur CommuniConseil')).toBeInTheDocument();
    expect(screen.getByText('Informations personnelles')).toBeInTheDocument();
    expect(screen.getByText('Expertise')).toBeInTheDocument();
    expect(screen.getByText('Validation')).toBeInTheDocument();
  });

  it('devrait afficher la première étape par défaut', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
    expect(screen.getByLabelText('Région')).toBeInTheDocument();
    expect(screen.getByLabelText('Téléphone (optionnel)')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('devrait naviguer entre les étapes', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Remplir la première étape
    const nameInput = screen.getByLabelText('Nom complet');
    const regionSelect = screen.getByLabelText('Région');
    
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    
    // Aller à l'étape suivante
    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);
    
    // Vérifier qu'on est à l'étape 2
    expect(screen.getByLabelText('Domaine d\'expertise')).toBeInTheDocument();
    expect(screen.getByText('Retour')).toBeInTheDocument();
  });

  it('devrait valider les champs requis à chaque étape', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Étape 1 - champs vides
    const nextButton = screen.getByText('Suivant');
    expect(nextButton).toBeDisabled();
    
    // Remplir le nom
    const nameInput = screen.getByLabelText('Nom complet');
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    expect(nextButton).toBeDisabled();
    
    // Sélectionner la région
    const regionSelect = screen.getByLabelText('Région');
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    expect(nextButton).toBeEnabled();
  });

  it('devrait afficher l\'étape d\'expertise', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Aller à l'étape 2
    const nameInput = screen.getByLabelText('Nom complet');
    const regionSelect = screen.getByLabelText('Région');
    
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    
    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);
    
    expect(screen.getByLabelText('Domaine d\'expertise')).toBeInTheDocument();
    expect(screen.getByText('Administration publique')).toBeInTheDocument();
    expect(screen.getByText('Médecine générale')).toBeInTheDocument();
  });

  it('devrait afficher l\'étape de validation', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Aller à l'étape 2
    const nameInput = screen.getByLabelText('Nom complet');
    const regionSelect = screen.getByLabelText('Région');
    
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    
    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);
    
    // Aller à l'étape 3
    const expertiseSelect = screen.getByLabelText('Domaine d\'expertise');
    fireEvent.mouseDown(expertiseSelect);
    fireEvent.click(screen.getByText('Administration publique'));
    
    const nextButton2 = screen.getByText('Suivant');
    fireEvent.click(nextButton2);
    
    // Vérifier l'étape de validation
    expect(screen.getByText('Vérifiez vos informations avant de soumettre votre demande.')).toBeInTheDocument();
    expect(screen.getByText('Nom: Mamadou Diallo')).toBeInTheDocument();
    expect(screen.getByText('Région: Conakry')).toBeInTheDocument();
    expect(screen.getByText('Domaine: Administration publique')).toBeInTheDocument();
  });

  it('devrait gérer la soumission du formulaire', async () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Remplir toutes les étapes
    const nameInput = screen.getByLabelText('Nom complet');
    const regionSelect = screen.getByLabelText('Région');
    
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    
    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);
    
    const expertiseSelect = screen.getByLabelText('Domaine d\'expertise');
    fireEvent.mouseDown(expertiseSelect);
    fireEvent.click(screen.getByText('Administration publique'));
    
    const nextButton2 = screen.getByText('Suivant');
    fireEvent.click(nextButton2);
    
    // Soumettre
    const submitButton = screen.getByText('Soumettre la demande');
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
    
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Soumission...')).toBeInTheDocument();
    expect(screen.getByText('Annuler')).toBeDisabled();
  });

  it('devrait afficher les erreurs', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation((selector) => {
      if (selector.name === 'selectCommuniConseilLoading') return false;
      if (selector.name === 'selectCommuniConseilError') return 'Erreur de soumission';
      return null;
    });
    
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    expect(screen.getByText('Erreur de soumission')).toBeInTheDocument();
  });

  it('devrait réinitialiser le formulaire à la fermeture', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    const nameInput = screen.getByLabelText('Nom complet');
    fireEvent.change(nameInput, { target: { value: 'Test nom' } });
    
    const cancelButton = screen.getByText('Annuler');
    fireEvent.click(cancelButton);
    
    expect(nameInput).toHaveValue('');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('devrait permettre de revenir en arrière', () => {
    render(<ContributorApplicationDialog {...defaultProps} />);
    
    // Aller à l'étape 2
    const nameInput = screen.getByLabelText('Nom complet');
    const regionSelect = screen.getByLabelText('Région');
    
    fireEvent.change(nameInput, { target: { value: 'Mamadou Diallo' } });
    fireEvent.mouseDown(regionSelect);
    fireEvent.click(screen.getByText('Conakry'));
    
    const nextButton = screen.getByText('Suivant');
    fireEvent.click(nextButton);
    
    // Revenir à l'étape 1
    const backButton = screen.getByText('Retour');
    fireEvent.click(backButton);
    
    expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
    expect(screen.queryByText('Retour')).not.toBeInTheDocument();
  });
}); 