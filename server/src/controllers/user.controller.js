// File: murali-n-tech/stackzyshop/server/src/controllers/user.controller.js
import admin from "firebase-admin";
import crypto from "crypto";
import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// ===============================
// 📌 FIREBASE ADMIN INITIALIZATION
// ===============================
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Or use serviceAccountKey.json
  });
}

// ===============================
// 📌 PHONE LOGIN (FIREBASE AUTH)
// ===============================
// @route   POST /api/users/phone-login
// @access  Public
export const phoneLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // 🔍 Verify Firebase ID token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const phoneNumber = decoded.phone_number;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number missing in token" });
    }

    // Check if user exists
    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({
        phoneNumber,
        email: `${phoneNumber}@stackzyshop.com`,
        name: `User-${phoneNumber.slice(-4)}`,
        password: crypto.randomBytes(8).toString("hex"), // random password
      });
    }

    const token = generateToken(res, user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error("Phone login error:", err.message);
    res.status(401).json({ message: "Invalid or expired Firebase token" });
  }
};

// ===============================
// 📌 REGISTER USER
// ===============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 LOGIN USER
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 GOOGLE AUTH
// ===============================
export const googleAuth = async (req, res) => {
  try {
    const { email, name, googleId } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      if (user.googleId === googleId) {
        const token = generateToken(res, user._id);
        res.status(200).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          role: user.role,
          token,
        });
      } else {
        res.status(401).json({
          message:
            "User already exists with this email. Please log in with your password.",
        });
      }
    } else {
      user = await User.create({ name, email, googleId });
      const token = generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        role: user.role,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 FORGOT PASSWORD
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: "Your Password Reset OTP",
        html: `Your OTP for password reset is: <strong>${otp}</strong>. It will expire in 10 minutes.`,
      });
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.error("Email sending failed:", error);
      user.resetPasswordOtp = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ message: "Error sending email" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid OTP or OTP has expired" });
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
      token,
    });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 GET USER PROFILE
// ===============================
export const getUserProfile = async (req, res) => {
  try {
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
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 GET ALL USERS (ADMIN)
// ===============================
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 DELETE USER (ADMIN)
// ===============================
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.isAdmin) {
        return res.status(400).json({ message: "Cannot delete an admin user" });
      }
      await User.deleteOne({ _id: user._id });
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// ===============================
// 📌 TOGGLE WISHLIST
// ===============================
export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const index = user.wishlist.indexOf(productId);

    if (index === -1) {
      user.wishlist.push(productId);
      await user.save();
      return res.json({
        message: "Product added to wishlist",
        wishlist: user.wishlist,
      });
    } else {
      user.wishlist.splice(index, 1);
      await user.save();
      return res.json({
        message: "Product removed from wishlist",
        wishlist: user.wishlist,
      });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};
