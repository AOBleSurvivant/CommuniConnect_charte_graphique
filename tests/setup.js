// Configuration globale pour les tests
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.PORT = 5001; // Port différent pour les tests

// Mock pour les logs
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn()
};

// Mock pour les timers
jest.useFakeTimers();

// Configuration des timeouts
jest.setTimeout(10000);

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
});

// Nettoyage global
afterAll(() => {
  jest.restoreAllMocks();
}); 