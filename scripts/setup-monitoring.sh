#!/bin/bash

echo "📊 CONFIGURATION DU MONITORING ET DES LOGS"
echo "=========================================="

# Installation des outils de monitoring
echo "📦 Installation des outils de monitoring..."

# Installer htop pour le monitoring système
sudo apt install -y htop

# Installer netdata pour le monitoring en temps réel
echo "📊 Installation de Netdata..."
bash <(curl -Ss https://my-netdata.io/kickstart.sh) --non-interactive

# Configuration des logs
echo "📝 Configuration des logs..."

# Créer le répertoire de logs
sudo mkdir -p /var/log/communiconnect
sudo chown communiconnect:communiconnect /var/log/communiconnect

# Configuration logrotate pour l'application
sudo tee /etc/logrotate.d/communiconnect << EOF
/var/log/communiconnect/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 communiconnect communiconnect
    postrotate
        systemctl reload nginx
        pm2 reload all
    endscript
}
EOF

# Configuration des alertes
echo "🚨 Configuration des alertes..."

# Script de monitoring personnalisé
sudo tee /usr/local/bin/monitor-communiconnect << 'EOF'
#!/bin/bash

# Variables
LOG_FILE="/var/log/communiconnect/monitoring.log"
ALERT_EMAIL="admin@communiconnect.gn"

# Fonctions de monitoring
check_disk_usage() {
    local usage=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
    if [ $usage -gt 80 ]; then
        echo "$(date): ALERTE - Utilisation disque: ${usage}%" >> $LOG_FILE
        # Envoyer une alerte par email
        echo "Alerte: Utilisation disque élevée (${usage}%)" | mail -s "Alerte CommuniConnect" $ALERT_EMAIL
    fi
}

check_memory_usage() {
    local usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ $usage -gt 80 ]; then
        echo "$(date): ALERTE - Utilisation mémoire: ${usage}%" >> $LOG_FILE
        echo "Alerte: Utilisation mémoire élevée (${usage}%)" | mail -s "Alerte CommuniConnect" $ALERT_EMAIL
    fi
}

check_pm2_status() {
    if ! pm2 list | grep -q "online"; then
        echo "$(date): ALERTE - PM2 processus down" >> $LOG_FILE
        echo "Alerte: PM2 processus down" | mail -s "Alerte CommuniConnect" $ALERT_EMAIL
        pm2 restart all
    fi
}

check_nginx_status() {
    if ! systemctl is-active --quiet nginx; then
        echo "$(date): ALERTE - Nginx down" >> $LOG_FILE
        echo "Alerte: Nginx down" | mail -s "Alerte CommuniConnect" $ALERT_EMAIL
        sudo systemctl restart nginx
    fi
}

check_ssl_certificate() {
    local domain="communiconnect.gn"
    local cert_expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    local expiry_date=$(date -d "$cert_expiry" +%s)
    local current_date=$(date +%s)
    local days_remaining=$(( ($expiry_date - $current_date) / 86400 ))
    
    if [ $days_remaining -lt 30 ]; then
        echo "$(date): ALERTE - Certificat SSL expire dans ${days_remaining} jours" >> $LOG_FILE
        echo "Alerte: Certificat SSL expire dans ${days_remaining} jours" | mail -s "Alerte CommuniConnect" $ALERT_EMAIL
    fi
}

# Exécuter les vérifications
check_disk_usage
check_memory_usage
check_pm2_status
check_nginx_status
check_ssl_certificate

echo "$(date): Monitoring terminé" >> $LOG_FILE
EOF

# Rendre le script exécutable
sudo chmod +x /usr/local/bin/monitor-communiconnect

# Ajouter au crontab pour exécution toutes les 5 minutes
(crontab -l 2>/dev/null; echo "*/5 * * * * /usr/local/bin/monitor-communiconnect") | crontab -

# Configuration des métriques PM2
echo "⚡ Configuration des métriques PM2..."

# Installer pm2-logrotate
pm2 install pm2-logrotate

# Configurer pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss

# Configuration des métriques système
echo "📈 Configuration des métriques système..."

# Installer sysstat pour les statistiques système
sudo apt install -y sysstat

# Activer la collecte de statistiques
sudo sed -i 's/ENABLED="false"/ENABLED="true"/' /etc/default/sysstat

# Redémarrer le service
sudo systemctl restart sysstat

# Configuration des alertes par email
echo "📧 Configuration des alertes par email..."

# Installer mailutils
sudo apt install -y mailutils

# Configuration postfix (optionnel)
echo "postfix postfix/mailname string communiconnect.gn" | sudo debconf-set-selections
echo "postfix postfix/main_mailer_type string 'Internet Site'" | sudo debconf-set-selections

# Script de rapport quotidien
sudo tee /usr/local/bin/daily-report << 'EOF'
#!/bin/bash

REPORT_FILE="/var/log/communiconnect/daily-report-$(date +%Y%m%d).log"
EMAIL="admin@communiconnect.gn"

echo "=== RAPPORT QUOTIDIEN COMMUNICONNECT - $(date) ===" > $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== STATUT DES SERVICES ===" >> $REPORT_FILE
systemctl status nginx --no-pager >> $REPORT_FILE
echo "" >> $REPORT_FILE
pm2 status >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== UTILISATION SYSTÈME ===" >> $REPORT_FILE
df -h >> $REPORT_FILE
echo "" >> $REPORT_FILE
free -h >> $REPORT_FILE

echo "" >> $REPORT_FILE
echo "=== LOGS D'ERREUR (dernières 50 lignes) ===" >> $REPORT_FILE
tail -50 /var/log/communiconnect/server-error.log >> $REPORT_FILE

# Envoyer le rapport par email
mail -s "Rapport quotidien CommuniConnect $(date +%Y-%m-%d)" $EMAIL < $REPORT_FILE
EOF

sudo chmod +x /usr/local/bin/daily-report

# Ajouter au crontab pour exécution quotidienne à 6h00
(crontab -l 2>/dev/null; echo "0 6 * * * /usr/local/bin/daily-report") | crontab -

echo ""
echo "✅ Configuration du monitoring terminée !"
echo ""
echo "📊 Outils disponibles:"
echo "   - Netdata: http://$(hostname -I | awk '{print $1}'):19999"
echo "   - PM2: pm2 monit"
echo "   - Logs: /var/log/communiconnect/"
echo "   - Monitoring: /usr/local/bin/monitor-communiconnect"
echo ""
echo "📋 Commandes utiles:"
echo "   pm2 monit                    # Interface de monitoring PM2"
echo "   pm2 logs                     # Voir les logs PM2"
echo "   htop                         # Monitoring système"
echo "   tail -f /var/log/communiconnect/*.log  # Suivre les logs" 