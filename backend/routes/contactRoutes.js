const express = require('express');
const { createContact } = require('../controllers/contactController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Contact API working' });
});

router.post('/', createContact);

module.exports = router;
