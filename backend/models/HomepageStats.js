const mongoose = require('mongoose');

const homepageStatsSchema = new mongoose.Schema(
  {
    yearsExperience: {
      type: String,
      required: true,
      default: '6+',
    },
    consultations: {
      type: String,
      required: true,
      default: '1500+',
    },
    clientSatisfaction: {
      type: String,
      required: true,
      default: '95%',
    },
    clientConfidence: {
      type: String,
      required: true,
      default: '98%',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('HomepageStats', homepageStatsSchema);
