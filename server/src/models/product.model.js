// server/src/models/product.model.js

import mongoose from 'mongoose';

// A sub-schema for reviews
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    // New fields for up/down votes
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// A sub-schema for answers
const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    answer: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// A sub-schema for questions
const qnaSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: { type: String, required: true },
    question: { type: String, required: true },
    answers: [answerSchema], // Each question can have multiple answers
  },
  {
    timestamps: true,
  }
);

// New sub-schema for product variants (e.g., sizes with stock)
const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
});


const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // The admin/seller who created the product
    },
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: [reviewSchema], // An array of review documents
    qna: [qnaSchema], // Array of questions with answers
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: { // Kept for non-variant products
      type: Number,
      required: true,
      default: 0,
    },
    sizes: {
      type: [String],
      required: function () {
        return this.category === 'Clothing';
      },
    },
    // New field for product variants (e.g., sizes with individual stock)
    variants: [variantSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;