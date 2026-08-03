import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      required: false,
    },
    minSpend: {
      type: Number,
      required: false,
    },
    expiry: {
      type: Date,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    useCount: {
      type: Number,
      required: true,
      default: 0,
    },
    usageLimit: {
      type: Number,
      required: true,
    },
    isHidden: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;
