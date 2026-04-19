const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 200,
  },
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    maxlength: 5000,
  },
  highlights: [{
    type: String,
  }],
  uses: [{
    type: String,
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  compareAtPrice: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    enum: ['EGP', 'JOD'],
    default: 'JOD',
  },
  // Multi-currency prices
  prices: {
    JOD: { type: Number },
    EGP: { type: Number },
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
  }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  isBundle: {
    type: Boolean,
    default: false,
  },
  bundleItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  stock: {
    type: Number,
    required: true,
    default: 100,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
  },
}, { timestamps: true });

// Auto-generate slug from name
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Sync prices
  if (this.isModified('price') && !this.prices?.JOD) {
    this.prices = {
      JOD: this.price,
      EGP: Math.round(this.price * 13.5), // approximate conversion
    };
  }
  next();
});

// Indexes
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
