const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.virtual('isLocked').get(function () {
  return this.lockUntil && this.lockUntil > Date.now();
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.incrementLoginAttempts = async function () {
  const updates = { $inc: { loginAttempts: 1 } };
  if (this.loginAttempts + 1 >= 5) {
    updates.$set = { lockUntil: new Date(Date.now() + 15 * 60 * 1000) };
  }
  await this.constructor.findByIdAndUpdate(this._id, updates);
};

adminSchema.methods.resetLoginAttempts = async function () {
  await this.constructor.findByIdAndUpdate(this._id, {
    $set: { loginAttempts: 0, lockUntil: null },
  });
};

module.exports = mongoose.model('Admin', adminSchema);
