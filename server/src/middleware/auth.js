const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check cookie first, then Authorization header
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw ApiError.unauthorized('Not authorized, no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      throw ApiError.unauthorized('User not found');
    }

    if (!req.user.isActive) {
      throw ApiError.forbidden('Account is deactivated');
    }

    next();
  } catch (error) {
    next(error.statusCode ? error : ApiError.unauthorized('Not authorized'));
  }
};

// Optional auth - attaches user if token exists, continues otherwise
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (error) {
    // Silently continue - user is just not authenticated
  }
  next();
};

// Admin only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    next(ApiError.forbidden('Admin access required'));
  }
};

module.exports = { protect, optionalAuth, admin };
