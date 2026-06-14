const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
    },
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, 'Date is required'],
      unique: true,
      trim: true,
    },
    slots: {
      type: [slotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

availabilitySchema.index({ 'slots.status': 1, date: 1 });

module.exports = mongoose.model('Availability', availabilitySchema);
