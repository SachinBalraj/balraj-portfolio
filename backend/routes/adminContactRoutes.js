const express = require('express');
const {
  getContacts,
  markAsRead,
  deleteContact,
} = require('../controllers/adminContactController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getContacts);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteContact);

module.exports = router;
