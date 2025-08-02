import React from 'react';
import { Add, Search } from '@mui/icons-material';

const ButtonTest = () => {
  const testCreatePost = () => {
    console.log('🧪 Test: Bouton Nouvelle publication cliqué');
    localStorage.setItem('showCreatePost', 'true');
    window.location.href = '/feed';
  };

  const testSearch = () => {
    console.log('🧪 Test: Bouton Rechercher cliqué');
    localStorage.setItem('showSearch', 'true');
    window.location.href = '/feed';
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      zIndex: 9999,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px'
    }}>
      <h4>🧪 Test Boutons</h4>
      <button 
        onClick={testCreatePost}
        style={{ 
          background: '#1976d2', 
          color: 'white', 
          border: 'none', 
          padding: '5px 10px', 
          margin: '2px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Nouvelle publication
      </button>
      <br />
      <button 
        onClick={testSearch}
        style={{ 
          background: 'transparent', 
          color: 'white', 
          border: '1px solid white', 
          padding: '5px 10px', 
          margin: '2px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Test Rechercher
      </button>
    </div>
  );
};

export default ButtonTest; 