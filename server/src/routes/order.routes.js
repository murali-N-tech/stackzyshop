import express from 'express';
import {
  addOrderItems,
  getOrderById,
  createRazorpayOrder,
  verifyPaymentAndUpdateOrder,
  getMyOrders,
  getOrders,
  updateOrderToDelivered, // --- NEW IMPORT ---
} from '../controllers/order.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- ADMIN ROUTE: GET ALL ORDERS ---
// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private/Admin
router.get('/', protect, admin, getOrders);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, addOrderItems);

// @route   GET /api/orders/myorders
// @desc    Get logged-in user's orders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// --- PAYMENT ROUTES ---
// @route   POST /api/orders/:id/create-razorpay-order
// @desc    Create Razorpay order for payment
// @access  Private
router.post('/:id/create-razorpay-order', protect, createRazorpayOrder);

// @route   POST /api/orders/:id/verify-payment
// @desc    Verify Razorpay payment and update order
// @access  Private
router.post('/:id/verify-payment', protect, verifyPaymentAndUpdateOrder);

// --- ADMIN ROUTE: UPDATE ORDER TO DELIVERED ---
// @route   PUT /api/orders/:id/deliver
// @desc    Update order status to Delivered
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

export default router;
