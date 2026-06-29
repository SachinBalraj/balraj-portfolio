const mongoose = require('mongoose');

const presentationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
      trim: true,
    },
    fileType: {
      type: String,
      default: '',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
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

presentationSchema.index({ published: 1, displayOrder: 1 });

module.exports = mongoose.model('Presentation', presentationSchema);
