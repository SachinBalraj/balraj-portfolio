const express = require('express');
const { getDashboard, updateDashboard } = require('../controllers/marketDashboardController');
const { protect } = require('../middleware/authMiddleware');

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.get('/', getDashboard);

adminRouter.get('/', protect, getDashboard);
adminRouter.put('/', protect, updateDashboard);

module.exports = { publicRouter, adminRouter };
