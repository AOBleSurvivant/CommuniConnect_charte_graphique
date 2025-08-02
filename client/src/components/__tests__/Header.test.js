import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Header from '../Header';

const mockStore = configureStore([]);

describe('Header Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          avatar: 'test-avatar.jpg'
        },
        isAuthenticated: true
      },
      notifications: {
        unreadCount: 5
      }
    });
  });

  const renderWithProviders = (component) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  test('renders header with logo and navigation', () => {
    renderWithProviders(<Header />);
    
    expect(screen.getByText(/CommuniConnect/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('displays user avatar when authenticated', () => {
    renderWithProviders(<Header />);
    
    const avatar = screen.getByAltText(/avatar/i);
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toContain('test-avatar.jpg');
  });

  test('shows notification badge with unread count', () => {
    renderWithProviders(<Header />);
    
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
  });

  test('displays user menu when avatar is clicked', () => {
    renderWithProviders(<Header />);
    
    const avatar = screen.getByAltText(/avatar/i);
    fireEvent.click(avatar);
    
    expect(screen.getByText(/Profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Déconnexion/i)).toBeInTheDocument();
  });

  test('handles logout when logout button is clicked', () => {
    const mockDispatch = jest.fn();
    store.dispatch = mockDispatch;
    
    renderWithProviders(<Header />);
    
    const avatar = screen.getByAltText(/avatar/i);
    fireEvent.click(avatar);
    
    const logoutButton = screen.getByText(/Déconnexion/i);
    fireEvent.click(logoutButton);
    
    expect(mockDispatch).toHaveBeenCalled();
  });

  test('shows search bar', () => {
    renderWithProviders(<Header />);
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('handles search input changes', () => {
    renderWithProviders(<Header />);
    
    const searchInput = screen.getByPlaceholderText(/Rechercher/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(searchInput.value).toBe('test search');
  });

  test('displays mobile menu button on small screens', () => {
    renderWithProviders(<Header />);
    
    const menuButton = screen.getByLabelText(/menu/i);
    expect(menuButton).toBeInTheDocument();
  });

  test('toggles mobile menu when menu button is clicked', () => {
    renderWithProviders(<Header />);
    
    const menuButton = screen.getByLabelText(/menu/i);
    fireEvent.click(menuButton);
    
    // Vérifier que le menu mobile est affiché
    expect(screen.getByRole('navigation')).toHaveClass('mobile-menu-open');
  });
}); 