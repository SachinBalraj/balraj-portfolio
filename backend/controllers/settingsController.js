const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        createdAt: admin.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;

    await admin.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
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

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please provide current and new password');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    const admin = await Admin.findById(req.admin.id).select('+password');

    if (!admin) {
      res.status(404);
      throw new Error('Admin not found');
    }

    const isMatch = await admin.comparePassword(currentPassword);

    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    admin.password = newPassword;
    await admin.save();

    const token = generateToken(admin._id);

    res.json({
      success: true,
      message: 'Password changed successfully',
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
