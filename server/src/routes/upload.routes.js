import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
import { protect, admin } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, admin, upload.single('image'), uploadImage);

export default router;