const path = require('path');
const InvestmentPlan = require('../models/InvestmentPlan');
const { saveFileToDb, deleteFileFromDb } = require('../utils/uploadHelper');

const getPlans = async (req, res, next) => {
  try {
    const plans = await InvestmentPlan.find().sort({ displayOrder: 1 });
    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

const createPlan = async (req, res, next) => {
  try {
    const { name, description, bestFor, features, horizon, risk, button, featured, isActive } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error('Plan name is required');
    }

    const maxOrder = await InvestmentPlan.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const nextOrder = (maxOrder?.displayOrder ?? -1) + 1;

    const plan = await InvestmentPlan.create({
      name: name.trim(),
      description: description || '',
      bestFor: bestFor || '',
      features: features || [],
      horizon: horizon || '',
      risk: risk || '',
      button: button || 'View Plan',
      featured: featured !== undefined ? featured : false,
      isActive: isActive !== undefined ? isActive : true,
      displayOrder: nextOrder,
    });

    res.status(201).json({
      success: true,
      message: 'Plan created successfully',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

const updatePlan = async (req, res, next) => {
  try {
    const { name, description, bestFor, features, horizon, risk, button, featured, isActive, displayOrder } = req.body;
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
    }

    if (name !== undefined) plan.name = name.trim();
    if (description !== undefined) plan.description = description;
    if (bestFor !== undefined) plan.bestFor = bestFor;
    if (features !== undefined) plan.features = features;
    if (horizon !== undefined) plan.horizon = horizon;
    if (risk !== undefined) plan.risk = risk;
    if (button !== undefined) plan.button = button;
    if (featured !== undefined) plan.featured = featured;
    if (isActive !== undefined) plan.isActive = isActive;
    if (displayOrder !== undefined) plan.displayOrder = displayOrder;

    await plan.save();

    res.json({
      success: true,
      message: 'Plan updated successfully',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

const uploadPlanFile = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
    }

    if (!req.file) {
      res.status(400);
      throw new Error('No file uploaded');
    }

    if (plan.fileUrl) {
      await deleteFileFromDb(plan.fileUrl);
    }

    const fileUrl = await saveFileToDb(req.file, 'investment-plans');

    plan.fileName = req.file.originalname;
    plan.fileUrl = fileUrl;
    plan.fileType = req.file.mimetype;
    plan.fileSize = req.file.size;
    plan.uploadedBy = req.admin?.name || req.admin?.email || 'Admin';
    await plan.save();

    res.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: plan.fileName,
        fileUrl: plan.fileUrl,
        fileType: plan.fileType,
        fileSize: plan.fileSize,
        uploadedBy: plan.uploadedBy,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deletePlanFile = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
    }

    if (plan.fileUrl) {
      await deleteFileFromDb(plan.fileUrl);
    }

    plan.fileName = '';
    plan.fileUrl = '';
    plan.fileType = '';
    plan.fileSize = 0;
    plan.uploadedBy = '';
    await plan.save();

    res.json({
      success: true,
      message: 'File deleted successfully',
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};

const deletePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
    }

    if (plan.fileUrl) {
      await deleteFileFromDb(plan.fileUrl);
    }

    await plan.deleteOne();

    res.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const reorderPlans = async (req, res, next) => {
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

    await InvestmentPlan.bulkWrite(bulkOps);

    const plans = await InvestmentPlan.find().sort({ displayOrder: 1 });

    res.json({
      success: true,
      message: 'Plans reordered successfully',
      data: plans,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlans, createPlan, updatePlan, uploadPlanFile, deletePlanFile, deletePlan, reorderPlans };
