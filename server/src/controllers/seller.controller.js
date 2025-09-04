import Seller from '../models/seller.model.js';
import User from '../models/user.model.js';

// @desc    Apply to become a seller
// @route   POST /api/sellers/apply
// @access  Private
const applyToBeSeller = async (req, res) => {
  try {
    const existingApplication = await Seller.findOne({ user: req.user._id });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already submitted an application.' });
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

export { applyToBeSeller, getSellerApplications, verifySeller };