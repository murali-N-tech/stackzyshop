// File: murali-n-tech/stackzyshop/stackzyshop-3235c54223918767faa652b708cef5187c89e7e7/server/src/models/user.model.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    isAdmin: { type: Boolean, required: true, default: false },

    // --- ADD NEW ROLE FIELD ---
    role: {
      type: String,
      required: true,
      default: 'user', // Can be 'user', 'seller', or 'admin'
      enum: ['user', 'seller', 'admin'], // restrict values
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // This creates a reference to the Product model
      },
    ],
    resetPasswordOtp: { type: String },
    resetPasswordExpires: { type: Date },

    // --- NEW: Phone Login fields ---
    phoneNumber: { type: String, unique: true, sparse: true }, // sparse: allow null values to be non-unique
    otp: { type: String },
    otpExpires: { type: Date },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// --- Hash password before saving ---
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// --- Method to compare entered password with hashed password ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;