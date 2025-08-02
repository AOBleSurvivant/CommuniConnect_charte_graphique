# Dockerfile pour CommuniConnect
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Installer les dépendances
RUN npm run install-all

# Copier le code source
COPY . .

# Construire l'application client
RUN cd client && npm run build

# Exposer le port
EXPOSE 5000

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=5000

# Commande de démarrage
CMD ["npm", "start"] 