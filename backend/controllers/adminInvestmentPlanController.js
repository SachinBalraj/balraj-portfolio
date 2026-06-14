const InvestmentPlan = require('../models/InvestmentPlan');

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
    const { name, bestFor, features, horizon, risk, button, featured, isActive } = req.body;

    if (!name || !name.trim()) {
      res.status(400);
      throw new Error('Plan name is required');
    }

    const maxOrder = await InvestmentPlan.findOne().sort({ displayOrder: -1 }).select('displayOrder');
    const nextOrder = (maxOrder?.displayOrder ?? -1) + 1;

    const plan = await InvestmentPlan.create({
      name: name.trim(),
      bestFor: bestFor || '',
      features: features || [],
      horizon: horizon || '',
      risk: risk || '',
      button: button || 'Schedule Consultation',
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
    const { name, bestFor, features, horizon, risk, button, featured, isActive, displayOrder } = req.body;
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
    }

    if (name !== undefined) plan.name = name.trim();
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

const deletePlan = async (req, res, next) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);

    if (!plan) {
      res.status(404);
      throw new Error('Plan not found');
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

module.exports = { getPlans, createPlan, updatePlan, deletePlan, reorderPlans };
