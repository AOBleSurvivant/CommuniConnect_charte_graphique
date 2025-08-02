const express = require('express');
const router = express.Router();

// Route temporaire pour les demandes d'aide
router.get('/', (req, res) => {
  res.json({ message: 'Routes demandes d\'aide - à développer' });
});

module.exports = router; 