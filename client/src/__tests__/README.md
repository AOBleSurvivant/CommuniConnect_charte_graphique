# 🧪 Tests CommuniConseil

Ce dossier contient une suite complète de tests pour le module CommuniConseil de l'application CommuniConnect.

## 📁 Structure des Tests

```
__tests__/
├── services/
│   └── communiconseilService.test.js          # Tests unitaires du service
├── components/CommuniConseil/
│   ├── CreatePublicationDialog.test.js        # Tests du dialogue de création
│   └── ContributorApplicationDialog.test.js   # Tests du dialogue de demande
├── pages/
│   └── CommuniConseil.test.js                # Tests de la page principale
├── utils/
│   └── communiconseilUtils.test.js            # Tests des utilitaires
├── integration/
│   └── CommuniConseil.integration.test.js    # Tests d'intégration
├── e2e/
│   └── CommuniConseil.e2e.test.js            # Tests end-to-end
└── README.md                                  # Cette documentation
```

## 🎯 Types de Tests

### 1. **Tests Unitaires** (`services/`, `utils/`)
- **Objectif** : Tester les fonctions individuelles
- **Couverture** : Logique métier, validation, formatage
- **Exemples** :
  - Validation des formulaires
  - Formatage des dates
  - Calcul des statistiques
  - Appels API

### 2. **Tests de Composants** (`components/`)
- **Objectif** : Tester les composants React isolément
- **Couverture** : Rendu, interactions, états
- **Exemples** :
  - Ouverture/fermeture des dialogues
  - Validation des formulaires
  - Gestion des erreurs
  - Navigation entre étapes

### 3. **Tests de Pages** (`pages/`)
- **Objectif** : Tester les pages complètes
- **Couverture** : Intégration des composants, Redux
- **Exemples** :
  - Chargement des données
  - Filtrage des publications
  - Gestion des états de chargement

### 4. **Tests d'Intégration** (`integration/`)
- **Objectif** : Tester l'interaction entre composants
- **Couverture** : Flux complets, communication API
- **Exemples** :
  - Création de publication complète
  - Demande de contributeur
  - Réactions aux publications

### 5. **Tests End-to-End** (`e2e/`)
- **Objectif** : Tester les scénarios utilisateur complets
- **Couverture** : Expérience utilisateur réelle
- **Exemples** :
  - Consultation des publications
  - Création de publication
  - Demande de contributeur
  - Gestion des erreurs

## 🚀 Exécution des Tests

### Installation des dépendances
```bash
npm install --save-dev @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

### Exécution de tous les tests
```bash
npm test
```

### Exécution des tests CommuniConseil spécifiquement
```bash
npm test -- --testPathPattern=CommuniConseil
```

### Exécution avec couverture
```bash
npm test -- --coverage --collectCoverageFrom="src/**/*.{js,jsx}"
```

### Exécution en mode watch
```bash
npm test -- --watch
```

## 📊 Métriques de Test

### Couverture Cible
- **Statements** : 90%
- **Branches** : 85%
- **Functions** : 90%
- **Lines** : 90%

### Fonctionnalités Testées

#### ✅ **Service CommuniConseil**
- [x] Récupération des publications
- [x] Récupération des catégories
- [x] Création de publication
- [x] Demande de contributeur
- [x] Réactions aux publications
- [x] Signalement de publications
- [x] Formatage des données

#### ✅ **Composants**
- [x] CreatePublicationDialog
  - [x] Validation des champs
  - [x] Gestion des erreurs
  - [x] États de chargement
  - [x] Réinitialisation du formulaire
- [x] ContributorApplicationDialog
  - [x] Navigation entre étapes
  - [x] Validation par étape
  - [x] Soumission du formulaire
  - [x] Gestion des erreurs

#### ✅ **Page CommuniConseil**
- [x] Chargement initial
- [x] Affichage des publications
- [x] Filtrage par catégorie
- [x] Ouverture des dialogues
- [x] Gestion des réactions
- [x] Gestion des signalements
- [x] États de chargement/erreur

#### ✅ **Utilitaires**
- [x] Formatage des dates
- [x] Validation des publications
- [x] Validation des demandes contributeur
- [x] Couleurs des catégories
- [x] Calcul des statistiques

## 🛠️ Configuration

### Jest Configuration
```javascript
// setupTests.js
import '@testing-library/jest-dom';

// Mocks globaux
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.sessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
```

### Mocks Utilisés
- **API Service** : Mock des appels HTTP
- **Redux Store** : Store de test configuré
- **React Router** : BrowserRouter pour les tests
- **Material-UI** : Composants mockés si nécessaire

## 📝 Bonnes Pratiques

### 1. **Nommage des Tests**
```javascript
describe('CommuniConseilService', () => {
  describe('getPublications', () => {
    it('devrait récupérer les publications avec succès', () => {
      // Test
    });
  });
});
```

### 2. **Structure AAA (Arrange, Act, Assert)**
```javascript
it('devrait valider une publication correcte', () => {
  // Arrange
  const publication = { title: 'Test', category: 'Santé', description: 'Longue description' };
  
  // Act
  const result = validatePublication(publication);
  
  // Assert
  expect(result.isValid).toBe(true);
});
```

### 3. **Mocks Appropriés**
```javascript
// Mock du service
jest.mock('../../services/communiconseilService');

// Mock des composants enfants
jest.mock('../../components/CommuniConseil/CreatePublicationDialog', () => {
  return function MockComponent({ open, onClose }) {
    return open ? <div data-testid="create-dialog">Mock</div> : null;
  };
});
```

### 4. **Tests Asynchrones**
```javascript
it('devrait charger les publications', async () => {
  // Arrange
  const mockPublications = [...];
  communiconseilService.getPublications.mockResolvedValue(mockPublications);
  
  // Act
  render(<CommuniConseil />);
  
  // Assert
  await waitFor(() => {
    expect(screen.getByText('Publication Test')).toBeInTheDocument();
  });
});
```

## 🔧 Debugging

### Mode Debug
```bash
npm test -- --verbose --no-coverage
```

### Tests Spécifiques
```bash
# Test spécifique
npm test -- --testNamePattern="devrait valider une publication"

# Fichier spécifique
npm test -- communiconseilService.test.js
```

### Logs de Test
```javascript
// Dans les tests
console.log('Debug info:', result);
```

## 📈 Maintenance

### Ajout de Nouveaux Tests
1. Identifier la fonctionnalité à tester
2. Choisir le type de test approprié
3. Créer le fichier de test dans le bon dossier
4. Suivre les conventions de nommage
5. Ajouter les mocks nécessaires
6. Exécuter les tests

### Mise à Jour des Tests
- Vérifier la compatibilité lors des changements d'API
- Mettre à jour les mocks si nécessaire
- Ajouter des tests pour les nouvelles fonctionnalités
- Maintenir la couverture de code

## 🚨 Dépannage

### Erreurs Communes

#### 1. **Erreur de Mock**
```javascript
// Solution : Vérifier que le mock est correctement configuré
jest.mock('../../services/communiconseilService', () => ({
  getPublications: jest.fn(),
  // ... autres méthodes
}));
```

#### 2. **Erreur de Render**
```javascript
// Solution : Wrapper avec les providers nécessaires
render(
  <Provider store={store}>
    <BrowserRouter>
      <CommuniConseil />
    </BrowserRouter>
  </Provider>
);
```

#### 3. **Erreur de Sélecteur**
```javascript
// Solution : Utiliser des data-testid
screen.getByTestId('create-dialog');
```

## 📚 Ressources

- [Testing Library Documentation](https://testing-library.com/)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Best Practices](https://reactjs.org/docs/testing.html)
- [Redux Testing](https://redux.js.org/usage/writing-tests)

---

**✅ Suite de tests CommuniConseil complète et opérationnelle !** 