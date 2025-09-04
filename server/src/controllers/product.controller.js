import Product from '../models/product.model.js';

// @desc    Fetch all products with pagination, search, and filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    const filter = {};
    if (req.query.keyword) {
      filter.name = { $regex: req.query.keyword, $options: 'i' };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.brand) {
      filter.brand = req.query.brand;
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/SellerOrAdmin
const createProduct = async (req, res) => {
  try {
    // FIXED: Added placeholder text to satisfy required fields in the model
    const product = new Product({
      name: 'New Product',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample Brand',
      category: 'Sample Category',
      countInStock: 0,
      numReviews: 0,
      description: 'Sample Description',
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/SellerOrAdmin
const updateProduct = async (req, res) => {
  try {
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/SellerOrAdmin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      if (product.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }
      const review = { name: req.user.name, rating: Number(rating), comment, user: req.user._id };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get logged-in seller's products
// @route   GET /api/products/myproducts
// @access  Private/Seller
const getMyProducts = async (req, res) => {
  try {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const filter = { user: req.user._id };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all unique product categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Product.find().distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all unique product brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await Product.find().distinct('brand');
    res.json(brands);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getTopProducts,
  getMyProducts,
  getCategories,
  getBrands,
};

