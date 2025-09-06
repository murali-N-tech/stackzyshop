// File: server/src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import 'dotenv/config';

// --- Middleware to protect routes for logged-in users ---
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- Middleware to protect admin routes ---
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // User is an admin, proceed
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// --- Middleware to protect seller routes (allows admins as well) ---
const seller = (req, res, next) => {
  if (req.user && (req.user.role === 'seller' || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as a seller' });
  }
};

export { protect, admin, seller };