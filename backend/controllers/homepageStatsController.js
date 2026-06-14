const mongoose = require('mongoose');
const HomepageStats = require('../models/HomepageStats');

const FALLBACK_STATS = {
  yearsExperience: '6+',
  consultations: '1500+',
  clientSatisfaction: '95%',
  clientConfidence: '98%',
  updatedAt: null,
};

const getStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: FALLBACK_STATS });
    }

    let stats = await HomepageStats.findOne();

    if (!stats) {
      stats = await HomepageStats.create({ ...FALLBACK_STATS, updatedAt: undefined });
    }

    res.json({
      success: true,
      data: {
        yearsExperience: stats.yearsExperience,
        consultations: stats.consultations,
        clientSatisfaction: stats.clientSatisfaction,
        clientConfidence: stats.clientConfidence,
        updatedAt: stats.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateStats = async (req, res, next) => {
  try {
    const { yearsExperience, consultations, clientSatisfaction, clientConfidence } = req.body;

    let stats = await HomepageStats.findOne();

    if (!stats) {
      stats = new HomepageStats({
        yearsExperience: yearsExperience || '6+',
        consultations: consultations || '1500+',
        clientSatisfaction: clientSatisfaction || '95%',
        clientConfidence: clientConfidence || '98%',
      });
    } else {
      if (yearsExperience !== undefined) stats.yearsExperience = yearsExperience;
      if (consultations !== undefined) stats.consultations = consultations;
      if (clientSatisfaction !== undefined) stats.clientSatisfaction = clientSatisfaction;
      if (clientConfidence !== undefined) stats.clientConfidence = clientConfidence;
    }

    await stats.save();

    res.json({
      success: true,
      message: 'Homepage stats updated successfully',
      data: {
        yearsExperience: stats.yearsExperience,
        consultations: stats.consultations,
        clientSatisfaction: stats.clientSatisfaction,
        clientConfidence: stats.clientConfidence,
        updatedAt: stats.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, updateStats };
