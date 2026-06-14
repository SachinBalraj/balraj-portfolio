const TeamCategory = require('../models/TeamCategory');

const createCategory = async (req, res, next) => {
  try {
    const { categoryName, description, members } = req.body;

    if (!categoryName || !categoryName.trim()) {
      res.status(400);
      throw new Error('Category name is required');
    }

    const maxOrder = await TeamCategory.findOne().sort({ order: -1 }).select('order');
    const nextOrder = (maxOrder?.order ?? -1) + 1;

    const category = await TeamCategory.create({
      categoryName: categoryName.trim(),
      description: description || '',
      order: nextOrder,
      members: members || [],
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { categoryName, description, members, order } = req.body;
    const category = await TeamCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    if (categoryName !== undefined) category.categoryName = categoryName.trim();
    if (description !== undefined) category.description = description;
    if (order !== undefined) category.order = order;
    if (members !== undefined) {
      if (members.length > 5) {
        res.status(400);
        throw new Error('Maximum 5 members per category');
      }
      category.members = members.map((m) =>
        typeof m === 'string' ? { name: m.trim() } : { name: String(m.name).trim() }
      );
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await TeamCategory.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400);
      throw new Error('items must be an array of { id, order }');
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } },
      },
    }));

    await TeamCategory.bulkWrite(bulkOps);

    const categories = await TeamCategory.find().sort({ order: 1, createdAt: 1 });

    res.json({
      success: true,
      message: 'Categories reordered successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await TeamCategory.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory, reorderCategories };
