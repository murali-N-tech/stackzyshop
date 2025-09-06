import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  createProductQuestion,
  createProductAnswer,
  getTopProducts,
  getMyProducts,
  getCategories,
  getBrands,
  getRelatedProducts, // NEW
} from '../controllers/product.controller.js';
import { protect, admin, seller } from '../middlewares/auth.middleware.js';

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/top', getTopProducts);

// --- SELLER-SPECIFIC ROUTES (must come before general /:id) ---
router.get('/myproducts', protect, seller, getMyProducts);

// --- USER-SPECIFIC ROUTES ---
router.post('/:id/reviews', protect, createProductReview);
router.post('/:id/questions', protect, createProductQuestion);
router.post('/:id/questions/:qid/answers', protect, createProductAnswer);

// --- SELLER & ADMIN ROUTES ---
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, seller, updateProduct);
router.delete('/:id', protect, seller, deleteProduct);

// --- DYNAMIC PUBLIC ROUTES (must be last) ---
router.get('/:id/related', getRelatedProducts); // NEW
router.get('/:id', getProductById);

export default router;
