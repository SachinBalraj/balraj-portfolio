const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [200, 'Company name cannot exceed 200 characters'],
    },
    investmentBudget: {
      type: String,
      required: [true, 'Investment budget is required'],
      trim: true,
    },
    meetingDate: {
      type: String,
      required: [true, 'Meeting date is required'],
      trim: true,
    },
    meetingTime: {
      type: String,
      required: [true, 'Meeting time is required'],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Contacted', 'Converted', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

consultationSchema.index({ meetingDate: 1, meetingTime: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);
