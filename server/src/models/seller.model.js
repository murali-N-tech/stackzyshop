import mongoose from 'mongoose';

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      unique: true, // A user can only have one seller profile
    },
    shopName: {
      type: String,
      required: true,
    },
    shopAddress: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model('Seller', sellerSchema);
export default Seller;