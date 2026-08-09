import { required } from 'joi';
import mongoose from 'mongoose';
import slugify from 'slugify';

const reviewsSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    SKU: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [reviewsSchema],
    rating: { type: Number, required: true, default: 0 },
    numberViews: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    countInStock: { type: Number, required: true, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

productSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug =
      slugify(this.name, { lower: true }) + '-' + this._id.toString().slice(-6);
  }
});

productSchema.pre(/^find/, function () {
  this.where({ isDeleted: { $ne: true } });
});

const Product = mongoose.model('Product', productSchema);

export default Product;
