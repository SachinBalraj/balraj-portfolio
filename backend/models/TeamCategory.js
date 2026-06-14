const mongoose = require('mongoose');

const teamCategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
    members: [
      {
        name: {
          type: String,
          required: [true, 'Member name is required'],
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

teamCategorySchema.index({ order: 1 });

module.exports = mongoose.model('TeamCategory', teamCategorySchema);
