const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Coupon code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true,
  },
  value: {
    type: Number,
    required: [true, 'Coupon value is required'],
    min: 0,
  },
  minPurchase: {
    type: Number,
    default: 0,
  },
  maxDiscount: {
    type: Number,
  },
  usageLimit: {
    type: Number,
    default: null,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

couponSchema.methods.isValid = function (cartTotal) {
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' };
  if (this.expiresAt < new Date()) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (cartTotal < this.minPurchase) return { valid: false, message: `Minimum purchase of ${this.minPurchase} required` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function (cartTotal) {
  let discount = 0;
  if (this.type === 'percentage') {
    discount = (cartTotal * this.value) / 100;
    if (this.maxDiscount) discount = Math.min(discount, this.maxDiscount);
  } else {
    discount = this.value;
  }
  return Math.min(discount, cartTotal);
};

module.exports = mongoose.model('Coupon', couponSchema);
