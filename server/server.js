import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectDB from './src/config/db.js';

// --- Import Routes ---
import userRoutes from './src/routes/user.routes.js';
import productRoutes from './src/routes/product.routes.js';
import orderRoutes from './src/routes/order.routes.js';
import configRoutes from './src/routes/config.routes.js';
import statsRoutes from './src/routes/stats.routes.js';
import sellerRoutes from './src/routes/seller.routes.js';
import couponRoutes from './src/routes/coupon.routes.js';

// --- Initialize Express App ---
const app = express();
connectDB();

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- API Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/config', configRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/coupons', couponRoutes);

// --- Start Server ---
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});