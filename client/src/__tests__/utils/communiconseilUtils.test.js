import { formatDate, validatePublication, validateContributorApplication, getCategoryColor, calculateReactionStats } from '../../utils/communiconseilUtils';

describe('CommuniConseil Utils', () => {
  describe('formatDate', () => {
    it('devrait formater une date correctement', () => {
      const date = new Date('2024-01-20T10:30:00Z');
      const formatted = formatDate(date);
      
      expect(formatted).toMatch(/20 janvier 2024/);
    });

    it('devrait gérer les dates invalides', () => {
      const invalidDate = 'date invalide';
      const formatted = formatDate(invalidDate);
      
      expect(formatted).toBe('Date inconnue');
    });

    it('devrait formater les dates récentes avec "aujourd\'hui"', () => {
      const today = new Date();
      const formatted = formatDate(today);
      
      expect(formatted).toMatch(/aujourd'hui/);
    });

    it('devrait formater les dates d\'hier avec "hier"', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const formatted = formatDate(yesterday);
      
      expect(formatted).toMatch(/hier/);
    });
  });

  describe('validatePublication', () => {
    it('devrait valider une publication correcte', () => {
      const publication = {
        title: 'Titre de publication suffisamment long',
        category: 'Santé',
        description: 'Description suffisamment longue pour valider le formulaire et permettre la création de la publication'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('devrait rejeter un titre trop court', () => {
      const publication = {
        title: 'Court',
        category: 'Santé',
        description: 'Description suffisamment longue'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre doit contenir entre 10 et 200 caractères');
    });

    it('devrait rejeter un titre trop long', () => {
      const publication = {
        title: 'A'.repeat(201),
        category: 'Santé',
        description: 'Description suffisamment longue'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le titre doit contenir entre 10 et 200 caractères');
    });

    it('devrait rejeter une description trop courte', () => {
      const publication = {
        title: 'Titre correct',
        category: 'Santé',
        description: 'Court'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La description doit contenir au moins 50 caractères');
    });

    it('devrait rejeter une catégorie manquante', () => {
      const publication = {
        title: 'Titre correct',
        category: '',
        description: 'Description suffisamment longue'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La catégorie est requise');
    });

    it('devrait rejeter une publication avec plusieurs erreurs', () => {
      const publication = {
        title: 'Court',
        category: '',
        description: 'Court'
      };

      const result = validatePublication(publication);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(3);
      expect(result.errors).toContain('Le titre doit contenir entre 10 et 200 caractères');
      expect(result.errors).toContain('La catégorie est requise');
      expect(result.errors).toContain('La description doit contenir au moins 50 caractères');
    });
  });

  describe('validateContributorApplication', () => {
    it('devrait valider une demande correcte', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        email: 'mamadou@exemple.com'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('devrait rejeter un nom manquant', () => {
      const application = {
        name: '',
        region: 'Conakry',
        expertise: 'Administration publique',
        email: 'mamadou@exemple.com'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le nom complet est requis');
    });

    it('devrait rejeter une région manquante', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: '',
        expertise: 'Administration publique',
        email: 'mamadou@exemple.com'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La région est requise');
    });

    it('devrait rejeter une expertise manquante', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: '',
        email: 'mamadou@exemple.com'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le domaine d\'expertise est requis');
    });

    it('devrait rejeter un email invalide', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        email: 'email-invalide'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('L\'email n\'est pas valide');
    });

    it('devrait accepter un téléphone optionnel', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        email: 'mamadou@exemple.com',
        phone: '22412345678'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('devrait rejeter un téléphone invalide', () => {
      const application = {
        name: 'Mamadou Diallo',
        region: 'Conakry',
        expertise: 'Administration publique',
        email: 'mamadou@exemple.com',
        phone: '123'
      };

      const result = validateContributorApplication(application);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Le numéro de téléphone n\'est pas valide');
    });
  });

  describe('getCategoryColor', () => {
    it('devrait retourner la couleur pour Santé', () => {
      const color = getCategoryColor('Santé');
      expect(color).toBe('#4CAF50');
    });

    it('devrait retourner la couleur pour Droit', () => {
      const color = getCategoryColor('Droit');
      expect(color).toBe('#2196F3');
    });

    it('devrait retourner la couleur pour Administration', () => {
      const color = getCategoryColor('Administration');
      expect(color).toBe('#FF9800');
    });

    it('devrait retourner la couleur pour Sécurité', () => {
      const color = getCategoryColor('Sécurité');
      expect(color).toBe('#F44336');
    });

    it('devrait retourner une couleur par défaut pour une catégorie inconnue', () => {
      const color = getCategoryColor('Catégorie Inconnue');
      expect(color).toBe('#9E9E9E');
    });
  });

  describe('calculateReactionStats', () => {
    it('devrait calculer les statistiques de réactions', () => {
      const reactions = {
        thanks: 15,
        useful: 8
      };

      const stats = calculateReactionStats(reactions);
      
      expect(stats.total).toBe(23);
      expect(stats.thanks).toBe(15);
      expect(stats.useful).toBe(8);
      expect(stats.thanksPercentage).toBe(65.22);
      expect(stats.usefulPercentage).toBe(34.78);
    });

    it('devrait gérer les réactions vides', () => {
      const reactions = {};

      const stats = calculateReactionStats(reactions);
      
      expect(stats.total).toBe(0);
      expect(stats.thanks).toBe(0);
      expect(stats.useful).toBe(0);
      expect(stats.thanksPercentage).toBe(0);
      expect(stats.usefulPercentage).toBe(0);
    });

    it('devrait gérer les réactions nulles', () => {
      const reactions = null;

      const stats = calculateReactionStats(reactions);
      
      expect(stats.total).toBe(0);
      expect(stats.thanks).toBe(0);
      expect(stats.useful).toBe(0);
      expect(stats.thanksPercentage).toBe(0);
      expect(stats.usefulPercentage).toBe(0);
    });

    it('devrait arrondir les pourcentages correctement', () => {
      const reactions = {
        thanks: 1,
        useful: 2
      };

      const stats = calculateReactionStats(reactions);
      
      expect(stats.total).toBe(3);
      expect(stats.thanksPercentage).toBe(33.33);
      expect(stats.usefulPercentage).toBe(66.67);
    });
  });
}); 