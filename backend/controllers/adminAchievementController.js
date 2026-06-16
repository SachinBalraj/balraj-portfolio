const Achievement = require('../models/Achievement');
const fs = require('fs');
const path = require('path');
const { saveFileToDb, deleteFileFromDb } = require('../utils/uploadHelper');

const createAchievement = async (req, res, next) => {
  try {
    const { title, year, displayOrder, isActive } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Title is required');
    }

    if (!year || !year.trim()) {
      res.status(400);
      throw new Error('Year is required');
    }

    const image = req.file ? await saveFileToDb(req.file, 'achievements') : '';

    const maxOrder = await Achievement.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const nextOrder = (maxOrder?.displayOrder ?? -1) + 1;

    const achievement = await Achievement.create({
      title: title.trim(),
      year: year.trim(),
      image,
      displayOrder: displayOrder ?? nextOrder,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const { title, year, displayOrder, isActive, removeImage } = req.body;
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      res.status(404);
      throw new Error('Achievement not found');
    }

    if (title !== undefined) achievement.title = title.trim();
    if (year !== undefined) achievement.year = year.trim();
    if (displayOrder !== undefined) achievement.displayOrder = displayOrder;
    if (isActive !== undefined) achievement.isActive = isActive;

    if (req.file) {
      if (achievement.image) {
        await deleteFileFromDb(achievement.image);
        const oldPath = path.join(__dirname, '..', achievement.image);
        try { fs.unlinkSync(oldPath); } catch {}
      }
      achievement.image = await saveFileToDb(req.file, 'achievements');
    }

    if (removeImage === 'true' || removeImage === true) {
      if (achievement.image) {
        await deleteFileFromDb(achievement.image);
        const oldPath = path.join(__dirname, '..', achievement.image);
        try { fs.unlinkSync(oldPath); } catch {}
      }
      achievement.image = '';
    }

    await achievement.save();

    res.json({
      success: true,
      message: 'Achievement updated successfully',
      data: achievement,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      res.status(404);
      throw new Error('Achievement not found');
    }

    if (achievement.image) {
      await deleteFileFromDb(achievement.image);
      const filePath = path.join(__dirname, '..', achievement.image);
      try { fs.unlinkSync(filePath); } catch {}
    }

    await achievement.deleteOne();

    res.json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const reorderAchievements = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400);
      throw new Error('items must be an array of { id, displayOrder }');
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    await Achievement.bulkWrite(bulkOps);

    const achievements = await Achievement.find().sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      message: 'Achievements reordered successfully',
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAchievements, createAchievement, updateAchievement, deleteAchievement, reorderAchievements };
