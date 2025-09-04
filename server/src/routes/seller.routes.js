import express from 'express';
import {
  applyToBeSeller,
  getSellerApplications,
  verifySeller,
} from '../controllers/seller.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/apply', protect, applyToBeSeller);
router.get('/', protect, admin, getSellerApplications);
router.put('/:id/verify', protect, admin, verifySeller);

export default router;