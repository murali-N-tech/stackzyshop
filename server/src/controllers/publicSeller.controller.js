import User from '../models/user.model.js';
import Seller from '../models/seller.model.js';
import Product from '../models/product.model.js';

// @desc    Get public seller profile by user ID
// @route   GET /api/sellers/:id
// @access  Public
const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.params.id }).populate('user', 'name');
    if (seller && seller.verificationStatus === 'Approved') {
      res.json({
        name: seller.user.name,
        shopName: seller.shopName,
      });
    } else {
      res.status(404).json({ message: 'Seller not found or not approved' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all products for a specific seller
// @route   GET /api/sellers/:id/products
// @access  Public
const getProductsBySeller = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const filter = { user: req.params.id };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export { getSellerById, getProductsBySeller };