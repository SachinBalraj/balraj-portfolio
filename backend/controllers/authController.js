const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const admin = await Admin.findOne({ email }).select('+password +loginAttempts +lockUntil');

    if (!admin) {
      console.warn(`Login attempt for non-existent email: ${email}`);
      res.status(401);
      throw new Error('Invalid credentials');
    }

    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      console.warn(`Locked account login attempt: ${email}`);
      res.status(429);
      throw new Error(`Account locked. Try again in ${minutesLeft} minute(s)`);
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      await admin.incrementLoginAttempts();
      const remainingLockouts = 5 - (admin.loginAttempts + 1);
      console.warn(`Failed login attempt for ${email}. ${remainingLockouts} attempts remaining`);
      res.status(401);
      throw new Error('Invalid credentials');
    }

    await admin.resetLoginAttempts();

    const token = generateToken(admin._id);
    console.log(`Successful login: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    res.status(200).json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe };
