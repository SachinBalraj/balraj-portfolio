const Presentation = require('../models/Presentation');

const getPresentations = async (req, res, next) => {
  try {
    const presentations = await Presentation.find({ published: true })
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: presentations.length,
      data: presentations.map((p) => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        fileName: p.fileName,
        fileUrl: p.fileUrl,
        fileType: p.fileType,
        fileSize: p.fileSize,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPresentations };
