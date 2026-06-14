const express = require('express');
const {
  getStats,
  updateStats,
} = require('../controllers/homepageStatsController');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get('/', getStats);

adminRouter.get('/', protect, getStats);
adminRouter.put('/', protect, updateStats);

module.exports = { publicRouter, adminRouter };
