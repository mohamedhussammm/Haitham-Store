const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Meal name is required'],
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
  // ── Nutrition Facts ──────────────────────────────────────────
  nutrition: {
    calories: { type: Number, min: 0 },
    protein:  { type: Number, min: 0 },   // grams
    carbs:    { type: Number, min: 0 },   // grams
    fat:      { type: Number, min: 0 },   // grams
    fiber:    { type: Number, min: 0 },   // grams
    sugar:    { type: Number, min: 0 },   // grams
  },
  // ── Dietary & Allergen Info ───────────────────────────────────
  dietaryTags: [{
    type: String,
    enum: ['keto', 'vegan', 'vegetarian', 'gluten-free', 'high-protein', 'low-carb', 'halal', 'dairy-free', 'low-fat', 'high-fiber'],
  }],
  allergens: [{ type: String }],
  ingredients: [{ type: String }],
  portionSize: { type: String },          // e.g. "450g", "1 box"
  // ── Meal Plan / Subscription cadence ─────────────────────────
  planCadence: {
    type: String,
    enum: ['one-off', 'weekly', 'monthly'],
    default: 'one-off',
  },
  // ── Pricing ───────────────────────────────────────────────────
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
    enum: ['EGP'],
    default: 'EGP',
  },
  prices: {
    EGP: { type: Number },
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  // ── Images ────────────────────────────────────────────────────
  images: [{
    url: { type: String, required: true },
    alt: { type: String, default: '' },
  }],
  // ── Category & Bundles ────────────────────────────────────────
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
  // ── Stock & Status ────────────────────────────────────────────
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
  // Sync EGP price
  if (this.isModified('price') && !this.prices?.EGP) {
    this.prices = { EGP: this.price };
  }
  next();
});

// Indexes
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ dietaryTags: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
