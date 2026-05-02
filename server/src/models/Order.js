const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  contact: {
    email: { type: String, required: [true, 'Email is required'] },
    phone: String,
  },
  shippingAddress: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    apartment: String,
    city: { type: String, required: true },
    postalCode: String,
    country: { type: String, default: 'Jordan' },
    phone: { type: String, required: true },
  },
  billingAddress: {
    sameAsShipping: { type: Boolean, default: true },
    firstName: String,
    lastName: String,
    address: String,
    apartment: String,
    city: String,
    postalCode: String,
    country: String,
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  }],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: {
    type: String,
    enum: ['EGP', 'JOD'],
    default: 'JOD',
  },
  shippingMethod: {
    name: { type: String, default: 'Standard Shipping' },
    cost: Number,
  },
  paymentMethod: {
    type: { type: String, enum: ['cod'], default: 'cod' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  coupon: {
    code: String,
    discount: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: String,
  saveInfo: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `HS-${String(count + 1001).padStart(6, '0')}`;
  }
  next();
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'contact.email': 1 });

module.exports = mongoose.model('Order', orderSchema);
