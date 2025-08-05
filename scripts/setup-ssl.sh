#!/bin/bash

echo "🔐 CONFIGURATION SSL AVEC LET'S ENCRYPT"
echo "======================================="

# Variables
DOMAIN=""
EMAIL=""

# Demander les informations
read -p "Entrez le nom de domaine (ex: communiconnect.gn): " DOMAIN
read -p "Entrez votre email: " EMAIL

echo ""
echo "📋 Configuration SSL:"
echo "   Domaine: $DOMAIN"
echo "   Email: $EMAIL"
echo ""

# Vérifier que Nginx est configuré
if [ ! -f "/etc/nginx/sites-available/communiconnect" ]; then
    echo "❌ Nginx n'est pas configuré. Exécutez d'abord setup-production.sh"
    exit 1
fi

# Installer Certbot si pas déjà installé
if ! command -v certbot &> /dev/null; then
    echo "📦 Installation de Certbot..."
    sudo apt update
    sudo apt install -y certbot python3-certbot-nginx
fi

# Obtenir le certificat SSL
echo "🔐 Obtention du certificat SSL..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Vérifier l'installation
echo "✅ Vérification du certificat..."
sudo certbot certificates

# Configurer le renouvellement automatique
echo "🔄 Configuration du renouvellement automatique..."
sudo crontab -l 2>/dev/null | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

# Test de la configuration Nginx
echo "🌐 Test de la configuration Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration Nginx valide"
    sudo systemctl reload nginx
else
    echo "❌ Erreur dans la configuration Nginx"
    exit 1
fi

# Test SSL
echo "🔒 Test de la configuration SSL..."
curl -I https://$DOMAIN

echo ""
echo "✅ Configuration SSL terminée !"
echo ""
echo "🔗 Votre site est maintenant accessible en HTTPS:"
echo "   https://$DOMAIN"
echo ""
echo "📋 Informations importantes:"
echo "   - Le certificat sera renouvelé automatiquement"
echo "   - Les logs sont dans /var/log/letsencrypt/"
echo "   - Test de renouvellement: sudo certbot renew --dry-run" 