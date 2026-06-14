const express = require('express');
const { getAllAchievements, getAchievementById } = require('../controllers/achievementController');

const router = express.Router();

router.get('/', getAllAchievements);
router.get('/:id', getAchievementById);

module.exports = router;
