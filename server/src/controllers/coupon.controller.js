import Coupon from '../models/coupon.model.js';

// @desc    Apply a coupon code
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    if (!coupon.isActive || new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ message: 'Coupon is expired or inactive' });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, expiryDate } = req.body;
    const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
    if (couponExists) {
        return res.status(400).json({ message: 'Coupon code already exists' });
    }
    const coupon = new Coupon({ code, discountType, discountValue, expiryDate });
    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({});
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

// --- NEW FUNCTION TO TOGGLE COUPON STATUS ---
// @desc    Toggle a coupon's active status
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Admin
const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (coupon) {
            coupon.isActive = !coupon.isActive;
            const updatedCoupon = await coupon.save();
            res.json(updatedCoupon);
        } else {
            res.status(404).json({ message: 'Coupon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

export { applyCoupon, createCoupon, getCoupons, toggleCouponStatus };
