const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      res.status(401);
      throw new Error('Not authorized, admin not found');
    }

    req.admin = { id: admin._id, name: admin.name, email: admin.email };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401);
      error.message = 'Not authorized, invalid token';
    }
    if (error.name === 'TokenExpiredError') {
      res.status(401);
      error.message = 'Not authorized, token expired';
    }
    next(error);
  }
};

module.exports = { protect };
