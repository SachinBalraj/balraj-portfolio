const Achievement = require('../models/Achievement');

const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: achievements.length,
      data: achievements.map((a) => ({
        _id: a._id,
        title: a.title,
        image: a.image,
        year: a.year,
        displayOrder: a.displayOrder,
      })),
    });
  } catch (error) {
    next(error);
  }
};

const getAchievementById = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      res.status(404);
      throw new Error('Achievement not found');
    }

    res.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllAchievements, getAchievementById };
