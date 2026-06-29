const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Plan name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    bestFor: {
      type: String,
      default: '',
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    horizon: {
      type: String,
      default: '',
      trim: true,
    },
    risk: {
      type: String,
      default: '',
      trim: true,
    },
    button: {
      type: String,
      default: 'View Plan',
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    fileName: {
      type: String,
      default: '',
    },
    fileUrl: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    uploadedBy: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

investmentPlanSchema.index({ isActive: 1, displayOrder: 1 });

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema);
