module.exports = {
  // Environnement de test
  testEnvironment: 'node',
  
  // Répertoires de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Répertoires à ignorer
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Collecte de couverture
  collectCoverage: true,
  collectCoverageFrom: [
    'server/**/*.js',
    'client/src/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/dist/**',
    '!**/build/**'
  ],
  
  // Seuil de couverture
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Répertoire de couverture
  coverageDirectory: 'coverage',
  
  // Transformations
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  
  // Setup des tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Variables d'environnement pour les tests
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // Timeout des tests
  testTimeout: 10000,
  
  // Verbosité
  verbose: true,
  
  // Couleurs
  colors: true,
  
  // Rapport de couverture
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Modules à mocker
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}; 