const InvestmentPlan = require('../models/InvestmentPlan');

const getAllPlans = async (req, res, next) => {
  try {
    const plans = await InvestmentPlan.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      count: plans.length,
      data: plans.map((p) => ({
        _id: p._id,
        name: p.name,
        description: p.description,
        bestFor: p.bestFor,
        features: p.features,
        horizon: p.horizon,
        risk: p.risk,
        button: p.button,
        featured: p.featured,
        displayOrder: p.displayOrder,
        fileName: p.fileName,
        fileUrl: p.fileUrl,
        fileType: p.fileType,
        fileSize: p.fileSize,
      })),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllPlans };
