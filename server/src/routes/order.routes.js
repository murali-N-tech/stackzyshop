import express from 'express';
import {
  addOrderItems,
  getOrderById,
  createRazorpayOrder,
  verifyPaymentAndUpdateOrder,
  getMyOrders,
  getOrders,
  getMySales,
  updateOrderStatus, // --- NEW IMPORT ---
} from '../controllers/order.controller.js';
import { protect, admin, seller } from '../middlewares/auth.middleware.js';

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

// --- SELLER ROUTE: GET SELLER'S SALES ---
// @route   GET /api/orders/mysales
// @desc    Get all orders that include seller's products
// @access  Private/Seller
router.get('/mysales', protect, seller, getMySales);

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

// --- FLEXIBLE STATUS UPDATE ROUTE (REPLACES /deliver) ---
// @route   PUT /api/orders/:id/status
// @desc    Update order status (Seller/Admin)
// @access  Private/SellerOrAdmin
router.put('/:id/status', protect, seller, updateOrderStatus);

export default router;
