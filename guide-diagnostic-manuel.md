# 🔍 GUIDE DE DIAGNOSTIC MANUEL - COMMUNICONNECT

## 📋 **PLAN DE DIAGNOSTIC SYSTÉMATIQUE**

### **🎯 OBJECTIF**
Tester chaque fonctionnalité du site une par une pour identifier les problèmes et les corriger.

---

## **🔐 1. AUTHENTIFICATION**

### **Page de Connexion (`/login`)**
- [ ] **Champ email/identifiant** : Saisie fonctionnelle
- [ ] **Champ mot de passe** : Saisie fonctionnelle  
- [ ] **Bouton de connexion** : Clic fonctionnel
- [ ] **Bouton Google** : Clic fonctionnel
- [ ] **Bouton Facebook** : Clic fonctionnel
- [ ] **Lien "Mot de passe oublié"** : Redirection vers `/forgot-password`
- [ ] **Lien "Créer un compte"** : Redirection vers `/register`

### **Page d'Inscription (`/register`)**
- [ ] **Champs personnels** : firstName, lastName, email
- [ ] **Champ mot de passe** : Saisie et validation
- [ ] **Champ confirmation mot de passe** : Validation
- [ ] **Bouton d'inscription** : Soumission fonctionnelle
- [ ] **Lien "Déjà un compte"** : Redirection vers `/login`

---

## **🧭 2. NAVIGATION**

### **Navigation Desktop**
- [ ] **Logo CommuniConnect** : Clic redirige vers `/`
- [ ] **Menu "Accueil"** : Redirection vers `/`
- [ ] **Menu "Feed"** : Redirection vers `/feed`
- [ ] **Menu "Événements"** : Redirection vers `/events`
- [ ] **Menu "Alertes"** : Redirection vers `/alerts`
- [ ] **Menu "Entraide"** : Redirection vers `/help`
- [ ] **Menu "Messages"** : Redirection vers `/messages`
- [ ] **Menu "Profil"** : Redirection vers `/profile`
- [ ] **Menu "Carte"** : Redirection vers `/map`

### **Navigation Mobile (Responsive)**
- [ ] **Bouton hamburger** : Ouverture du menu mobile
- [ ] **Logo à gauche** : Position correcte
- [ ] **Menu hamburger centré** : Position correcte
- [ ] **Actions à droite** : Position correcte
- [ ] **Menu mobile** : Tous les liens fonctionnels

### **Actions Rapides (Page d'accueil)**
- [ ] **"Demander de l'aide"** : Redirection vers `/help`
- [ ] **"Créer un événement"** : Redirection vers `/events`
- [ ] **"Signaler un problème"** : Redirection vers `/alerts`
- [ ] **"Nouveau message"** : Redirection vers `/messages`

---

## **📰 3. FEED ET PUBLICATIONS**

### **Page Feed (`/feed`)**
- [ ] **Bouton "Créer une publication"** : Ouverture du formulaire
- [ ] **Champ de saisie** : Texte fonctionnel
- [ ] **Bouton "Publier"** : Soumission fonctionnelle
- [ ] **Onglets de filtrage** : Tous les onglets cliquables
  - [ ] "Tous"
  - [ ] "Actualités"
  - [ ] "Événements"
  - [ ] "Alertes"
  - [ ] "Entraide"

### **Actions sur les Posts**
- [ ] **Bouton "Like"** : Incrémentation du compteur
- [ ] **Bouton "Commenter"** : Ouverture du champ de commentaire
- [ ] **Bouton "Partager"** : Fonction de partage
- [ ] **Bouton "Signaler"** : Ouverture du formulaire de signalement

### **Commentaires**
- [ ] **Champ de saisie** : Texte fonctionnel
- [ ] **Bouton "Envoyer"** : Soumission du commentaire
- [ ] **Liste des commentaires** : Affichage correct

---

## **📅 4. ÉVÉNEMENTS**

### **Page Événements (`/events`)**
- [ ] **Bouton "Créer un événement"** : Ouverture du formulaire
- [ ] **Formulaire de création** : Tous les champs fonctionnels
  - [ ] Titre de l'événement
  - [ ] Description
  - [ ] Date et heure
  - [ ] Lieu
  - [ ] Type d'événement
  - [ ] Image (upload)
- [ ] **Bouton "Publier"** : Soumission fonctionnelle

### **Filtres d'Événements**
- [ ] **Filtre par type** : Sélection fonctionnelle
- [ ] **Filtre par date** : Sélection fonctionnelle
- [ ] **Filtre par lieu** : Sélection fonctionnelle
- [ ] **Recherche** : Champ de recherche fonctionnel

### **Actions sur les Événements**
- [ ] **Bouton "Participer"** : Inscription à l'événement
- [ ] **Bouton "Détails"** : Ouverture des détails
- [ ] **Bouton "Partager"** : Partage de l'événement
- [ ] **Bouton "Signaler"** : Signalement de l'événement

---

## **🚨 5. ALERTES**

### **Page Alertes (`/alerts`)**
- [ ] **Bouton "Créer une alerte"** : Ouverture du formulaire
- [ ] **Formulaire de création** : Tous les champs fonctionnels
  - [ ] Titre de l'alerte
  - [ ] Description
  - [ ] Type d'alerte
  - [ ] Niveau d'urgence
  - [ ] Localisation
- [ ] **Bouton "Publier"** : Soumission fonctionnelle

### **Filtres d'Alertes**
- [ ] **Filtre par type** : Sélection fonctionnelle
- [ ] **Filtre par urgence** : Sélection fonctionnelle
- [ ] **Filtre par date** : Sélection fonctionnelle
- [ ] **Recherche** : Champ de recherche fonctionnel

### **Actions sur les Alertes**
- [ ] **Bouton "Partager"** : Partage de l'alerte
- [ ] **Bouton "Détails"** : Ouverture des détails
- [ ] **Bouton "Signaler"** : Signalement de l'alerte

---

## **🤝 6. ENTR'AIDE**

### **Page Entraide (`/help`)**
- [ ] **Bouton "Nouvelle demande"** : Ouverture du formulaire
- [ ] **Formulaire de demande** : Tous les champs fonctionnels
  - [ ] Titre de la demande
  - [ ] Description détaillée
  - [ ] Catégorie
  - [ ] Niveau d'urgence
- [ ] **Bouton "Publier"** : Soumission fonctionnelle

### **Onglets d'Entraide**
- [ ] **Onglet "Mes demandes"** : Affichage des demandes personnelles
- [ ] **Onglet "Demandes ouvertes"** : Affichage des demandes publiques
- [ ] **Onglet "Demandes résolues"** : Affichage des demandes résolues

### **Actions sur les Demandes**
- [ ] **Bouton "Répondre"** : Ouverture du formulaire de réponse
- [ ] **Bouton "Marquer comme résolu"** : Résolution de la demande
- [ ] **Bouton "Détails"** : Ouverture des détails

---

## **💬 7. MESSAGERIE**

### **Page Messages (`/messages`)**
- [ ] **Bouton "Nouveau message"** : Ouverture du formulaire
- [ ] **Liste des conversations** : Affichage des conversations
- [ ] **Sélection d'une conversation** : Ouverture du chat
- [ ] **Champ de saisie** : Texte fonctionnel
- [ ] **Bouton "Envoyer"** : Envoi du message

### **Actions de Messagerie**
- [ ] **Recherche de contacts** : Champ de recherche fonctionnel
- [ ] **Création de groupe** : Bouton de création de groupe
- [ ] **Paramètres de conversation** : Accès aux paramètres

---

## **👤 8. PROFIL**

### **Page Profil (`/profile`)**
- [ ] **Bouton "Modifier"** : Ouverture du formulaire d'édition
- [ ] **Formulaire d'édition** : Tous les champs fonctionnels
  - [ ] Prénom
  - [ ] Nom
  - [ ] Email
  - [ ] Téléphone
  - [ ] Adresse
  - [ ] Bio
- [ ] **Upload photo profil** : Sélection et upload d'image
- [ ] **Bouton "Sauvegarder"** : Sauvegarde des modifications

### **Onglets du Profil**
- [ ] **Onglet "Informations"** : Affichage des infos personnelles
- [ ] **Onglet "Activités"** : Affichage des activités
- [ ] **Onglet "Paramètres"** : Accès aux paramètres
- [ ] **Onglet "Sécurité"** : Gestion de la sécurité

---

## **🗺️ 9. CARTE**

### **Page Carte (`/map`)**
- [ ] **Carte interactive** : Affichage de la carte
- [ ] **Boutons de filtrage** : Filtrage des éléments
  - [ ] Événements
  - [ ] Alertes
  - [ ] Services
- [ ] **Bouton "Itinéraire"** : Calcul d'itinéraire
- [ ] **Bouton "Partager"** : Partage de localisation
- [ ] **Recherche d'adresse** : Champ de recherche fonctionnel

---

## **🛡️ 10. MODÉRATION**

### **Page Modération (`/moderation`)**
- [ ] **Onglets de modération** : Navigation entre les onglets
  - [ ] Publications
  - [ ] Commentaires
  - [ ] Utilisateurs
- [ ] **Filtres de modération** : Filtrage des éléments
- [ ] **Boutons d'action** : Actions de modération
  - [ ] "Approuver"
  - [ ] "Rejeter"
  - [ ] "Avertir"
  - [ ] "Bannir"

---

## **⚙️ 11. ADMINISTRATION**

### **Page Admin (`/admin`)**
- [ ] **Onglets admin** : Navigation entre les sections
  - [ ] Tableau de bord
  - [ ] Utilisateurs
  - [ ] Modération
  - [ ] Statistiques
  - [ ] Paramètres
- [ ] **Cartes de statistiques** : Affichage des stats
- [ ] **Boutons d'action** : Actions administratives
  - [ ] "Actualiser"
  - [ ] "Exporter"
  - [ ] "Importer"

---

## **📊 RÉSULTATS DU DIAGNOSTIC**

### **✅ FONCTIONNALITÉS OPÉRATIONNELLES**
- [ ] Authentification
- [ ] Navigation
- [ ] Feed et publications
- [ ] Événements
- [ ] Alertes
- [ ] Entraide
- [ ] Messagerie
- [ ] Profil
- [ ] Carte
- [ ] Modération
- [ ] Administration

### **❌ PROBLÈMES IDENTIFIÉS**
- [ ] **Fonctionnalité** : Description du problème
- [ ] **Fonctionnalité** : Description du problème
- [ ] **Fonctionnalité** : Description du problème

### **🔧 CORRECTIONS À APPORTER**
- [ ] **Problème 1** : Solution proposée
- [ ] **Problème 2** : Solution proposée
- [ ] **Problème 3** : Solution proposée

---

## **🎯 SCORE GLOBAL**

**Score par fonctionnalité :**
- Authentification : ___%
- Navigation : ___%
- Feed : ___%
- Événements : ___%
- Alertes : ___%
- Entraide : ___%
- Messagerie : ___%
- Profil : ___%
- Carte : ___%
- Modération : ___%
- Administration : ___%

**Score global : ___%**

**Statut :** ⚠️ À AMÉLIORER / ✅ BON / 🎯 EXCELLENT

---

## **📝 NOTES ET OBSERVATIONS**

### **Problèmes Techniques**
- [ ] Erreurs console
- [ ] Problèmes de performance
- [ ] Problèmes de responsive
- [ ] Problèmes d'accessibilité

### **Améliorations Suggérées**
- [ ] Fonctionnalité 1
- [ ] Fonctionnalité 2
- [ ] Fonctionnalité 3

---

*Rapport généré le : ___/___/____*
*Diagnostic effectué par : ___* 