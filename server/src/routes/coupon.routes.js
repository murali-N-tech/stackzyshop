import express from 'express';
import { 
    applyCoupon, 
    createCoupon, 
    getCoupons, 
    toggleCouponStatus 
} from '../controllers/coupon.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User route
router.post('/apply', protect, applyCoupon);

// Admin routes
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getCoupons);
// --- NEW ROUTE TO TOGGLE STATUS ---
router.put('/:id/toggle', protect, admin, toggleCouponStatus);

export default router;
