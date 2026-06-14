const mongoose = require('mongoose');

const founderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Balraj',
      trim: true,
    },
    title: {
      type: String,
      default: 'Crypto Investment Advisor',
      trim: true,
    },
    shortDescription: {
      type: String,
      default: 'Guiding investors through the world of cryptocurrency with strategic insights, blockchain expertise, and proven investment approaches designed for sustainable growth and long-term financial success.',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    linkedinUrl: {
      type: String,
      default: '',
      trim: true,
    },
    twitterUrl: {
      type: String,
      default: '',
      trim: true,
    },
    telegramUrl: {
      type: String,
      default: '',
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Founder', founderSchema);
