import Product from '../models/product.model.js';
import Seller from '../models/seller.model.js';

// @desc    Fetch all products with pagination, search, and filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 9;
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
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }
    }

    let sortOrder = {};
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sortOrder = { price: 1 };
          break;
        case 'price-desc':
          sortOrder = { price: -1 };
          break;
        case 'rating-desc':
          sortOrder = { rating: -1 };
          break;
        default:
          sortOrder = { createdAt: -1 };
      }
    } else {
      sortOrder = { createdAt: -1 };
    }

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOrder)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Fetch a single product by ID (with seller info)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (product) {
      const sellerProfile = await Seller.findOne({ user: product.user._id });

      const productWithSeller = {
        ...product.toObject(),
        seller: {
          name: product.user.name,
          email: product.user.email,
          shopName: sellerProfile ? sellerProfile.shopName : 'Official Store',
        },
      };

      res.json(productWithSeller);
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
    const product = new Product({
      name: 'New Product',
      price: 0,
      user: req.user._id,
      images: ['/images/sample.jpg'],
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
    const { name, price, description, images, brand, category, countInStock } =
      req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      if (
        product.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      product.name = name;
      product.price = price;
      product.description = description;
      product.images = images;
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
      if (
        product.user.toString() !== req.user._id.toString() &&
        !req.user.isAdmin
      ) {
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

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new question
// @route   POST /api/products/:id/questions
// @access  Private
const createProductQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const newQuestion = {
        name: req.user.name,
        question,
        user: req.user._id,
      };

      product.qna.push(newQuestion);
      await product.save();
      res.status(201).json({ message: 'Question submitted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new answer
// @route   POST /api/products/:id/questions/:qid/answers
// @access  Private
const createProductAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const question = product.qna.id(req.params.qid);

      if (question) {
        const newAnswer = {
          name: req.user.name,
          answer,
          user: req.user._id,
        };
        question.answers.push(newAnswer);
        await product.save();
        res.status(201).json({ message: 'Answer submitted' });
      } else {
        res.status(404).json({ message: 'Question not found' });
      }
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

// @desc    Get related products and frequently bought together suggestions
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(5);

    const frequentlyBought = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(2);

    res.json({ related, frequentlyBought });
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
  createProductQuestion,
  createProductAnswer,
  getRelatedProducts,
};
