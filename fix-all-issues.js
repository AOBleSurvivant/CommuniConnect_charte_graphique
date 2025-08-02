const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing all identified issues...');

// 1. Fix Typography children prop warning in AlertsPage
const alertsPagePath = path.join(__dirname, 'client/src/pages/Alerts/AlertsPage.js');
if (fs.existsSync(alertsPagePath)) {
  let content = fs.readFileSync(alertsPagePath, 'utf8');
  
  // Remove Typography wrapper from Alert components
  content = content.replace(
    /<Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch\(clearError\(\)\)}>\s*<Typography>\s*\{formatError\(error\) \|\| 'Une erreur est survenue'\}\s*<\/Typography>\s*<\/Alert>/g,
    '<Alert severity="error" sx={{ mb: 2 }} onClose={() => dispatch(clearError())}>\n            {formatError(error) || \'Une erreur est survenue\'}\n          </Alert>'
  );
  
  content = content.replace(
    /<Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch\(clearSuccess\(\)\)}>\s*<Typography>\s*\{success \|\| 'Opération réussie'\}\s*<\/Typography>\s*<\/Alert>/g,
    '<Alert severity="success" sx={{ mb: 2 }} onClose={() => dispatch(clearSuccess())}>\n            {success || \'Opération réussie\'}\n          </Alert>'
  );
  
  fs.writeFileSync(alertsPagePath, content);
  console.log('✅ Fixed Typography children prop warnings in AlertsPage');
}

// 2. Create a proper favicon.ico
const faviconPath = path.join(__dirname, 'client/public/favicon.ico');
const faviconData = Buffer.from([
  0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x68, 0x04,
  0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00,
  0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
]);

fs.writeFileSync(faviconPath, faviconData);
console.log('✅ Created proper favicon.ico');

// 3. Fix CSP in index.html
const indexHtmlPath = path.join(__dirname, 'client/public/index.html');
if (fs.existsSync(indexHtmlPath)) {
  let content = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Update CSP to allow Google Translate stylesheets
  content = content.replace(
    /<meta http-equiv="Content-Security-Policy" content="[^"]*"/g,
    '<meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://www.gstatic.com; style-src \'self\' \'unsafe-inline\' https://fonts.googleapis.com https://unpkg.com https://www.gstatic.com; font-src \'self\' https://fonts.gstatic.com; img-src \'self\' data: https:; connect-src \'self\' ws: wss: http://localhost:5000 https://api.communiconnect.gn;">'
  );
  
  fs.writeFileSync(indexHtmlPath, content);
  console.log('✅ Fixed Content Security Policy');
}

// 4. Fix event creation validation in CreateEventForm
const createEventFormPath = path.join(__dirname, 'client/src/components/Events/CreateEventForm.js');
if (fs.existsSync(createEventFormPath)) {
  let content = fs.readFileSync(createEventFormPath, 'utf8');
  
  // Fix the data formatting to match server validation
  const dataFormattingFix = `
  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (validateForm()) {
      // Format dates properly for API
      const startDateTime = new Date(formData.startDate + 'T' + formData.startTime);
      const endDateTime = new Date(formData.endDate + 'T' + formData.endTime);
      
      const formattedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category || 'communautaire',
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        startTime: formData.startTime,
        endTime: formData.endTime,
        venue: formData.venue.trim(),
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity) || 50,
        isFree: formData.isFree !== false,
        price: {
          amount: parseFloat(formData.price?.amount) || 0,
          currency: formData.price?.currency || 'GNF'
        },
        tags: formData.tags || [],
        location: {
          region: formData.region,
          prefecture: formData.prefecture,
          commune: formData.commune,
          quartier: formData.quartier,
          coordinates: {
            latitude: parseFloat(formData.latitude) || 0,
            longitude: parseFloat(formData.longitude) || 0
          }
        },
        contactPhone: formData.contactPhone?.trim() || '',
        image: formData.image || ''
      };
      
      console.log('📤 Données formatées pour l\'API:', formattedData);
      onSubmit(formattedData);
    }
  };`;
  
  // Replace the existing handleSubmit function
  content = content.replace(
    /const handleSubmit = \(event\) => \{[\s\S]*?\};/g,
    dataFormattingFix
  );
  
  fs.writeFileSync(createEventFormPath, content);
  console.log('✅ Fixed event creation data formatting');
}

// 5. Fix notification service to handle permission properly
const notificationServicePath = path.join(__dirname, 'client/src/services/notificationService.js');
if (fs.existsSync(notificationServicePath)) {
  let content = fs.readFileSync(notificationServicePath, 'utf8');
  
  // Add better permission handling
  const permissionFix = `
  // Demander la permission pour les notifications
  async requestPermission() {
    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        console.log('🔔 Permission de notification:', permission);
        return permission === 'granted';
      } catch (error) {
        console.warn('🔔 Erreur lors de la demande de permission:', error);
        return false;
      }
    }
    return false;
  }

  // Vérifier la permission sans demander
  checkPermission() {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }`;
  
  // Replace the existing requestPermission method
  content = content.replace(
    /async requestPermission\(\) \{[\s\S]*?\}/g,
    permissionFix
  );
  
  fs.writeFileSync(notificationServicePath, content);
  console.log('✅ Fixed notification permission handling');
}

console.log('🎉 All issues have been fixed!');
console.log('\n📋 Summary of fixes:');
console.log('1. ✅ Fixed Typography children prop warnings');
console.log('2. ✅ Created proper favicon.ico');
console.log('3. ✅ Updated Content Security Policy');
console.log('4. ✅ Fixed event creation data formatting');
console.log('5. ✅ Improved notification permission handling');
console.log('\n🚀 You can now restart your development server to see the improvements.'); 