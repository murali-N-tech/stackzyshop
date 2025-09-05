import express from 'express';
import {
  applyToBeSeller,
  getSellerApplications,
  verifySeller,
} from '../controllers/seller.controller.js';

// --- IMPORT NEW PUBLIC CONTROLLERS ---
import {
  getSellerById,
  getProductsBySeller,
} from '../controllers/publicSeller.controller.js';

import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ---------------- PRIVATE ROUTES ----------------
// Apply to become a seller (user)
router.post('/apply', protect, applyToBeSeller);

// Get all seller applications (admin only)
router.get('/', protect, admin, getSellerApplications);

// Verify a seller application (admin only)
router.put('/:id/verify', protect, admin, verifySeller);

// ---------------- PUBLIC ROUTES ----------------
// Get seller profile by ID
router.get('/:id', getSellerById);

// Get all products of a seller
router.get('/:id/products', getProductsBySeller);

export default router;
