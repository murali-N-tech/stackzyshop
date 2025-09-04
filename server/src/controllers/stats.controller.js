import Order from '../models/order.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Use the MongoDB Aggregation Pipeline to calculate total sales
    const totalSales = await Order.aggregate([
      {
        $group: {
          _id: null, // Group all documents into a single result
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales: totalSales.length > 0 ? totalSales[0].totalSales : 0,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export { getStats };