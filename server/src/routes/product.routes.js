import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
  getCategories, // new
  getBrands,     // new
} from '../controllers/product.controller.js';
import { protect, admin, seller } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', getProducts);
router.get('/categories', getCategories); // NEW
router.get('/brands', getBrands);         // NEW
router.get('/top', getTopProducts);

// --- SELLER-SPECIFIC ROUTES (must come before general /:id) ---
router.get('/myproducts', protect, seller, getMyProducts);

// --- USER-SPECIFIC ROUTES ---
router.post('/:id/reviews', protect, createProductReview);

// --- SELLER & ADMIN ROUTES ---
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, seller, deleteProduct);

// --- DYNAMIC PUBLIC ROUTE (must be last) ---
router.get('/:id', getProductById);

export default router;
