import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focusVisible, setFocusVisible] = useState(true);

  useEffect(() => {
    // Charger les préférences depuis localStorage
    const savedHighContrast = localStorage.getItem('highContrast') === 'true';
    const savedLargeText = localStorage.getItem('largeText') === 'true';
    const savedReducedMotion = localStorage.getItem('reducedMotion') === 'true';
    const savedFocusVisible = localStorage.getItem('focusVisible') !== 'false';

    setHighContrast(savedHighContrast);
    setLargeText(savedLargeText);
    setReducedMotion(savedReducedMotion);
    setFocusVisible(savedFocusVisible);

    // Appliquer les styles
    applyAccessibilityStyles(savedHighContrast, savedLargeText, savedReducedMotion, savedFocusVisible);
  }, []);

  const applyAccessibilityStyles = (hc, lt, rm, fv) => {
    const root = document.documentElement;
    
    // High contrast
    if (hc) {
      root.style.setProperty('--contrast-ratio', '4.5:1');
      root.style.setProperty('--text-color', '#000000');
      root.style.setProperty('--background-color', '#FFFFFF');
    } else {
      root.style.removeProperty('--contrast-ratio');
      root.style.removeProperty('--text-color');
      root.style.removeProperty('--background-color');
    }

    // Large text
    if (lt) {
      root.style.setProperty('--font-size-base', '18px');
      root.style.setProperty('--font-size-large', '20px');
    } else {
      root.style.setProperty('--font-size-base', '16px');
      root.style.setProperty('--font-size-large', '18px');
    }

    // Reduced motion
    if (rm) {
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.setProperty('--transition-duration', '0.3s');
    }

    // Focus visible
    if (fv) {
      root.style.setProperty('--focus-outline', '2px solid #1976d2');
    } else {
      root.style.setProperty('--focus-outline', 'none');
    }
  };

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    applyAccessibilityStyles(newValue, largeText, reducedMotion, focusVisible);
  };

  const toggleLargeText = () => {
    const newValue = !largeText;
    setLargeText(newValue);
    localStorage.setItem('largeText', newValue.toString());
    applyAccessibilityStyles(highContrast, newValue, reducedMotion, focusVisible);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem('reducedMotion', newValue.toString());
    applyAccessibilityStyles(highContrast, largeText, newValue, focusVisible);
  };

  const toggleFocusVisible = () => {
    const newValue = !focusVisible;
    setFocusVisible(newValue);
    localStorage.setItem('focusVisible', newValue.toString());
    applyAccessibilityStyles(highContrast, largeText, reducedMotion, newValue);
  };

  const value = {
    highContrast,
    largeText,
    reducedMotion,
    focusVisible,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    toggleFocusVisible,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 