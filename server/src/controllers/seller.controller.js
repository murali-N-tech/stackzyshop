import Seller from '../models/seller.model.js';
import User from '../models/user.model.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// @desc    Apply to become a seller
// @route   POST /api/sellers/apply
// @access  Private
const applyToBeSeller = async (req, res) => {
  try {
    const existingApplication = await Seller.findOne({ user: req.user._id });
    if (existingApplication) {
      return res
        .status(400)
        .json({ message: 'You have already submitted an application.' });
    }

    const { shopName, shopAddress, phoneNumber, gstNumber } = req.body;
    const seller = new Seller({
      user: req.user._id,
      shopName,
      shopAddress,
      phoneNumber,
      gstNumber,
    });
    const createdSellerProfile = await seller.save();
    res.status(201).json(createdSellerProfile);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all seller applications
// @route   GET /api/sellers
// @access  Private/Admin
const getSellerApplications = async (req, res) => {
  try {
    const sellers = await Seller.find({}).populate('user', 'name email');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Verify or reject a seller application
// @route   PUT /api/sellers/:id/verify
// @access  Private/Admin
const verifySeller = async (req, res) => {
  try {
    const { status } = req.body; // Expecting { status: 'Approved' } or { status: 'Rejected' }
    const seller = await Seller.findById(req.params.id);

    if (seller) {
      seller.verificationStatus = status;
      const updatedSeller = await seller.save();

      // If approved, update the user's role to 'seller'
      if (status === 'Approved') {
        await User.findByIdAndUpdate(seller.user, { role: 'seller' });
      } else {
        await User.findByIdAndUpdate(seller.user, { role: 'user' });
      }

      res.json(updatedSeller);
    } else {
      res.status(404).json({ message: 'Seller application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get statistics for the logged-in seller
// @route   GET /api/sellers/stats
// @access  Private/Seller
const getSellerStats = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user._id);

    // 1. Total Sales and Order Count
    const salesData = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $match: { 'orderItems.seller': sellerId, isPaid: true } },
      {
        $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
          totalOrders: { $addToSet: '$_id' }, // Use $addToSet to count unique orders
        },
      },
      {
        $project: {
            _id: 0,
            totalSales: 1,
            totalOrders: { $size: '$totalOrders' }
        }
      }
    ]);

    // 2. Total Products
    const totalProducts = await Product.countDocuments({ user: sellerId });

    // 3. Sales over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesOverTime = await Order.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo }, isPaid: true } },
        { $unwind: '$orderItems' },
        { $match: { 'orderItems.seller': sellerId } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                dailySales: { $sum: { $multiply: ["$orderItems.qty", "$orderItems.price"] } }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    // 4. Top 5 Performing Products
    const topProducts = await Order.aggregate([
        { $match: { isPaid: true } },
        { $unwind: '$orderItems' },
        { $match: { 'orderItems.seller': sellerId } },
        {
            $group: {
                _id: '$orderItems.product',
                name: { $first: '$orderItems.name' },
                totalRevenue: { $sum: { $multiply: ['$orderItems.qty', '$orderItems.price'] } },
                unitsSold: { $sum: '$orderItems.qty' }
            }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 5 }
    ]);

    res.json({
      totalSales: salesData[0]?.totalSales || 0,
      totalOrders: salesData[0]?.totalOrders || 0,
      totalProducts,
      salesOverTime,
      topProducts,
    });
  } catch (error) {
    console.error(`Error fetching seller stats: ${error.message}`);
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


export { applyToBeSeller, getSellerApplications, verifySeller, getSellerStats };
