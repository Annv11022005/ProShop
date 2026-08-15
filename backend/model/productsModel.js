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

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  fileId: {
    type: String,
  },
});

const VariantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  images: { type: [imageSchema], required: false },
  sku: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  reserved: { type: Number, required: true, default: 0 },
});

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
    subtitle: { type: String, required: false },
    slug: {
      type: String,
      unique: true,
    },
    image: [imageSchema],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [reviewsSchema],
    rating: { type: Number, required: true, default: 0 },
    numberViews: { type: Number, required: true, default: 0 },
    variants: [VariantSchema],
    qtySold: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['Draft', 'Active', 'Schedule'],
      default: 'Draft',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
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

productSchema.virtual('minPrice').get(function () {
  if (!this.variants.length) return 0;
  return Math.min(...this.variants.map((v) => v.price));
});

VariantSchema.virtual('available').get(function () {
  return this.countInStock - this.reserved;
});

const Product = mongoose.model('Product', productSchema);

export default Product;
