const mongoose = require('mongoose');

const marketDashboardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: 'BDX Current Price',
    },
    currentPrice: {
      type: String,
      trim: true,
      default: '₹7.51',
    },
    networkStatus: {
      type: String,
      trim: true,
      default: 'Active',
    },
    recommendedHorizon: {
      type: String,
      trim: true,
      default: '3–5 Years',
    },
    currentTrend: {
      type: String,
      trim: true,
      default: 'Bullish',
    },
    chartData: [
      {
        label: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MarketDashboard', marketDashboardSchema);
