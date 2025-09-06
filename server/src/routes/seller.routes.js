import express from 'express';
import {
  applyToBeSeller,
  getSellerApplications,
  verifySeller,
  getSellerStats, // Add this
} from '../controllers/seller.controller.js';

// --- IMPORT NEW PUBLIC CONTROLLERS ---
import {
  getSellerById,
  getProductsBySeller,
} from '../controllers/publicSeller.controller.js';

import { protect, admin, seller } from '../middlewares/auth.middleware.js'; // Add seller here

const router = express.Router();

// ---------------- PRIVATE ROUTES ----------------
// Apply to become a seller (user)
router.post('/apply', protect, applyToBeSeller);

// Get all seller applications (admin only)
router.get('/', protect, admin, getSellerApplications);

// Verify a seller application (admin only)
router.put('/:id/verify', protect, admin, verifySeller);

// Get stats for the logged-in seller
router.get('/stats', protect, seller, getSellerStats); // <-- ADD THIS ROUTE

// ---------------- PUBLIC ROUTES ----------------
// Get seller profile by ID
router.get('/:id', getSellerById);

// Get all products of a seller
router.get('/:id/products', getProductsBySeller);

export default router;
