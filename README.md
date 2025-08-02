# CommuniConnect 🌍

Plateforme web communautaire destinée à connecter les habitants d'un même quartier, ville ou pays afin de renforcer la communication locale, favoriser l'entraide citoyenne et faciliter la participation aux activités sociales.

## 🎯 Objectifs

- **Renforcer la communication locale**
- **Favoriser l'entraide citoyenne**
- **Faciliter la participation aux activités sociales**
- **Centraliser les alertes et annonces utiles à la population**

## 🚀 Fonctionnalités Principales

### 👥 Gestion des utilisateurs
- Inscription/Connexion via email, téléphone ou réseaux sociaux
- Gestion du profil (nom, adresse, photo, quartier, ville, etc.)
- Niveaux d'accès : Utilisateur, Modérateur, Administrateur
- Possibilité de créer un compte pour un voisin

### 📱 Publications et fil d'actualité
- Publication de texte, images ou vidéos
- Ajout d'icônes contextuelles : entraide, vente, alerte, besoin, etc.
- Boutons de réaction : "J'aime", "Je participe", "Je soutiens"
- Commentaires et réponses

### 🆘 Demandes d'aide
- Formulaire simplifié pour poster une demande
- Catégories prédéfinies : alimentaire, soins, sécurité, logement, etc.
- Ajout d'un champ "Je demande pour un voisin"
- Système de suivi des réponses et actions entreprises

### 🚨 Alertes
- Types d'alerte prédéfinis :
  - Incendie 🔥
  - Coupure d'électricité ⚡
  - Route bloquée 🚧
  - Personne disparue 🧒
  - Tapage nocturne 🔊
  - Accident 🚑
  - Cambriolage 🔐
- Notification en temps réel aux utilisateurs concernés
- Possibilité d'ajouter un fichier ou une image

### 📅 Événements communautaires
- Annonces d'événements : réunions, campagnes de nettoyage, formations, etc.
- Détail : description, lieu, date, heure
- Système de participation / rappel
- Ajout de documents ou affiches

### 🗺️ Carte interactive
- Géolocalisation des alertes, aides, événements
- Filtres par type, date, quartier

### 🛡️ Espace de Modération
- Tableau de bord pour modérateurs
- Signalement par les utilisateurs
- Gestion des publications problématiques
- Attribution de rôles par l'administrateur général

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** + **Express.js**
- **MongoDB** avec **Mongoose**
- **JWT** pour l'authentification
- **Multer** pour la gestion des fichiers
- **Socket.io** pour les notifications temps réel

### Frontend
- **React.js** avec **TypeScript**
- **Material-UI** pour l'interface
- **React Router** pour la navigation
- **Axios** pour les requêtes API
- **Leaflet** pour les cartes interactives

### Services
- **Cloudinary** pour le stockage des images
- **Firebase Cloud Messaging** pour les notifications push

## 📁 Structure du Projet

```
communiConnect_gn/
├── server/                 # Backend Node.js/Express
│   ├── controllers/        # Contrôleurs des routes
│   ├── models/            # Modèles MongoDB
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware personnalisé
│   ├── utils/             # Utilitaires
│   └── config/            # Configuration
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages de l'application
│   │   ├── services/      # Services API
│   │   ├── hooks/         # Hooks personnalisés
│   │   └── utils/         # Utilitaires
│   └── public/            # Fichiers statiques
├── docs/                  # Documentation
└── data/                  # Données géographiques de la Guinée
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- MongoDB
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd communiConnect_gn
```

2. **Installer toutes les dépendances**
```bash
npm run install-all
```

3. **Configuration de l'environnement**
```bash
# Copier les fichiers d'environnement
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. **Configurer les variables d'environnement**
- Modifier `server/.env` avec vos paramètres MongoDB et autres services
- Modifier `client/.env` avec l'URL de votre API

5. **Démarrer l'application**
```bash
# Mode développement (backend + frontend)
npm run dev

# Ou séparément
npm run server    # Backend uniquement
npm run client    # Frontend uniquement
```

## 🌍 Données Géographiques

Le projet inclut les données géographiques complètes de la Guinée avec :
- 8 régions administratives
- Préfectures et sous-préfectures
- Coordonnées GPS précises
- Structure hiérarchique complète

## 🔐 Sécurité

- Authentification JWT sécurisée
- Chiffrement des mots de passe avec bcrypt
- Protection contre les attaques XSS et CSRF
- Validation des données côté serveur
- Conformité RGPD

## 📱 Accessibilité

- Interface responsive (mobile, tablette, PC)
- Design adapté aux utilisateurs malvoyants
- Navigation au clavier
- Contraste respecté

## 🤝 Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support, contactez l'équipe CommuniConnect.

---

**CommuniConnect** - Connecter les communautés, renforcer les liens 🌟 