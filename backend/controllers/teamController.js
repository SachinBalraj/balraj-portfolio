const TeamCategory = require('../models/TeamCategory');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await TeamCategory.find().sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const category = await TeamCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCategories, getCategoryById };
