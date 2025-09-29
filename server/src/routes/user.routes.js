// File: murali-n-tech/stackzyshop/server/src/routes/user.routes.js
import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile, // --- NEW: Import the update controller ---
  getUsers,
  deleteUser,
  toggleWishlist,
  forgotPassword,
  resetPassword,
  googleAuth,
  phoneLogin,
} from '../controllers/user.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- ADMIN ROUTES ---
router.get('/', protect, admin, getUsers);
router.delete('/:id', protect, admin, deleteUser);

// --- PUBLIC & USER ROUTES ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- NEW: Combined GET and PUT for profile ---
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile); // --- NEW: Add the PUT route for updates ---

router.put('/wishlist', protect, toggleWishlist);

// --- PASSWORD RESET ROUTES ---
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// --- GOOGLE OAUTH ROUTE ---
router.post('/google-auth', googleAuth);

// --- PHONE AUTH ROUTE (Firebase) ---
router.post('/phone-login', phoneLogin);

export default router;