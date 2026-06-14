const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({ isActive: 1, displayOrder: 1 });
achievementSchema.index({ year: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);
