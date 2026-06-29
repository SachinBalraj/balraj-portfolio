const path = require('path');
const Presentation = require('../models/Presentation');
const { saveFileToDb, deleteFileFromDb } = require('../utils/uploadHelper');

const getPresentations = async (req, res, next) => {
  try {
    const presentations = await Presentation.find().sort({ displayOrder: 1 });
    res.json({ success: true, data: presentations });
  } catch (error) {
    next(error);
  }
};

const createPresentation = async (req, res, next) => {
  try {
    const { title, description, published } = req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Title is required');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('File is required');
    }

    const fileUrl = await saveFileToDb(req.file, 'presentations');
    const maxOrder = await Presentation.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const nextOrder = (maxOrder?.displayOrder ?? -1) + 1;

    const presentation = await Presentation.create({
      title: title.trim(),
      description: description || '',
      fileName: req.file.originalname,
      fileUrl,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      published: published !== undefined ? published : true,
      displayOrder: nextOrder,
      uploadedBy: req.admin?.name || req.admin?.email || 'Admin',
    });

    res.status(201).json({
      success: true,
      message: 'Presentation created successfully',
      data: presentation,
    });
  } catch (error) {
    next(error);
  }
};

const updatePresentation = async (req, res, next) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      res.status(404);
      throw new Error('Presentation not found');
    }

    const { title, description, published, displayOrder } = req.body;

    if (title !== undefined) presentation.title = title.trim();
    if (description !== undefined) presentation.description = description;
    if (published !== undefined) presentation.published = published;
    if (displayOrder !== undefined) presentation.displayOrder = displayOrder;

    if (req.file) {
      await deleteFileFromDb(presentation.fileUrl);
      const fileUrl = await saveFileToDb(req.file, 'presentations');
      presentation.fileName = req.file.originalname;
      presentation.fileUrl = fileUrl;
      presentation.fileType = req.file.mimetype;
      presentation.fileSize = req.file.size;
      presentation.uploadedBy = req.admin?.name || req.admin?.email || 'Admin';
    }

    await presentation.save();

    res.json({
      success: true,
      message: 'Presentation updated successfully',
      data: presentation,
    });
  } catch (error) {
    next(error);
  }
};

const deletePresentation = async (req, res, next) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      res.status(404);
      throw new Error('Presentation not found');
    }

    await deleteFileFromDb(presentation.fileUrl);
    await presentation.deleteOne();

    res.json({
      success: true,
      message: 'Presentation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const reorderPresentations = async (req, res, next) => {
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

    await Presentation.bulkWrite(bulkOps);

    const presentations = await Presentation.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      message: 'Presentations reordered successfully',
      data: presentations,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPresentations, createPresentation, updatePresentation, deletePresentation, reorderPresentations };
