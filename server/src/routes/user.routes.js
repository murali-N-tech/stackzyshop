import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
  toggleWishlist,
  forgotPassword,
  resetPassword,
  googleAuth, // Import the new controller
} from '../controllers/user.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- ADMIN ROUTES ---
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

// --- PUBLIC & USER ROUTES ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/wishlist', protect, toggleWishlist);

// --- PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- GOOGLE OAUTH ROUTE ---
router.post('/google-auth', googleAuth); // Add the new route


export default router;