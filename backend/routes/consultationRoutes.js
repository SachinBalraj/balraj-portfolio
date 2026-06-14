const express = require('express');
const { createConsultation } = require('../controllers/consultationController');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Consultation API working' });
});

router.post('/', createConsultation);

module.exports = router;
