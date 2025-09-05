import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true, // Standardize coupon codes to be uppercase
    },
    discountType: {
      type: String,
      required: true,
      enum: ['Percentage', 'Fixed'], // The type of discount
    },
    discountValue: {
      type: Number,
      required: true, // The value (e.g., 10 for 10% or 100 for ₹100)
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model('Coupon', couponSchema);

// --- THIS IS THE MISSING LINE THAT FIXES THE BUG ---
export default Coupon;
