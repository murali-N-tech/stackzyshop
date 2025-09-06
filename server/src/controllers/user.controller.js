import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

// --- REGISTER USER ---
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password hashed by mongoose pre-save hook)
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(res, user._id); // Generate token on register
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role, // Add user role to response
        token: token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- LOGIN USER ---
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check user existence & password
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- GOOGLE LOGIN ---
// @desc    Handle Google OAuth login
// @route   POST /api/users/google-login
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, ensure googleId is linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // If user does not exist, create a new one
      user = await User.create({
        name,
        email,
        googleId,
        // No password for Google-based accounts
      });
    }

    const token = generateToken(res, user._id);
    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token: token,
    });

  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};


// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send OTP to user's email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Your Password Reset OTP',
        html: `Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.`,
      });
      res.status(200).json({ message: 'OTP sent to your email' });
    } catch (error) {
      // ADD THIS FOR BETTER DEBUGGING
      console.error('Email sending failed:', error);
      
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: 'Error sending email' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- RESET PASSWORD ---
const resetPassword = async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const user = await User.findOne({
            email,
            resetPasswordOtp: otp,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid OTP or OTP has expired' });
        }

        user.password = password;
        user.resetPasswordOtp = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const token = generateToken(res, user._id);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            role: user.role,
            token: token,
        });

    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// --- GET USER PROFILE ---
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    // req.user is set by the 'protect' middleware
    const user = req.user;

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        wishlist: user.wishlist || [],
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- GET ALL USERS (ADMIN ONLY) ---
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- DELETE A USER (ADMIN ONLY) ---
// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Prevent an admin from deleting their own account
      if (user.isAdmin) {
        return res.status(400).json({ message: 'Cannot delete an admin user' });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- TOGGLE WISHLIST ---
// @desc    Add/Remove product from wishlist
// @route   PUT /api/users/wishlist
// @access  Private
const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product already in wishlist
    const index = user.wishlist.indexOf(productId);

    if (index === -1) {
      // If not present, add it
      user.wishlist.push(productId);
      await user.save();
      return res.json({ message: 'Product added to wishlist', wishlist: user.wishlist });
    } else {
      // If present, remove it
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({ message: 'Product removed from wishlist', wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
  toggleWishlist,
  forgotPassword,
  resetPassword,
  googleLogin,
};