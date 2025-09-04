import express from 'express';
import { getStats } from '../controllers/stats.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, admin, getStats);

export default router;