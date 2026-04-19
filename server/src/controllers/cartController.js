const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// Helper: get or create cart
const getOrCreateCart = async (userId, sessionId) => {
  let cart;
  if (userId) {
    cart = await Cart.findOne({ user: userId }).populate('items.product', 'name slug price images stock prices');
  } else if (sessionId) {
    cart = await Cart.findOne({ sessionId }).populate('items.product', 'name slug price images stock prices');
  }
  if (!cart) {
    cart = await Cart.create({ user: userId || undefined, sessionId: userId ? undefined : sessionId, items: [] });
  }
  return cart;
};

// GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    const cart = await getOrCreateCart(req.user?._id, sessionId);
    res.json(new ApiResponse(200, cart));
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/add
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    const product = await Product.findById(productId);
    if (!product) throw ApiError.notFound('Product not found');
    if (!product.isActive) throw ApiError.badRequest('Product is not available');
    if (product.stock < quantity) throw ApiError.badRequest('Insufficient stock');

    let cart = await getOrCreateCart(req.user?._id, sessionId);

    // Check if item already in cart
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId || item.product._id?.toString() === productId
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images stock prices');

    res.json(new ApiResponse(200, cart, 'Item added to cart'));
  } catch (error) {
    next(error);
  }
};

// PUT /api/cart/update/:itemId
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    let cart = await getOrCreateCart(req.user?._id, sessionId);
    const item = cart.items.id(req.params.itemId);
    if (!item) throw ApiError.notFound('Cart item not found');

    // Check stock
    const product = await Product.findById(item.product._id || item.product);
    if (product.stock < quantity) throw ApiError.badRequest('Insufficient stock');

    item.quantity = quantity;
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images stock prices');

    res.json(new ApiResponse(200, cart, 'Cart updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/remove/:itemId
exports.removeCartItem = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    let cart = await getOrCreateCart(req.user?._id, sessionId);

    cart.items = cart.items.filter((item) => item._id.toString() !== req.params.itemId);
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images stock prices');

    res.json(new ApiResponse(200, cart, 'Item removed'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/clear
exports.clearCart = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    const cart = await getOrCreateCart(req.user?._id, sessionId);
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();
    res.json(new ApiResponse(200, cart, 'Cart cleared'));
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/apply-coupon
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) throw ApiError.notFound('Coupon not found');

    let cart = await getOrCreateCart(req.user?._id, sessionId);
    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const validation = coupon.isValid(subtotal);
    if (!validation.valid) throw ApiError.badRequest(validation.message);

    const discount = coupon.calculateDiscount(subtotal);
    cart.coupon = { code: coupon.code, discount, type: coupon.type };
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images stock prices');

    res.json(new ApiResponse(200, cart, `Coupon applied: -${discount} off`));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/cart/remove-coupon
exports.removeCoupon = async (req, res, next) => {
  try {
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];
    let cart = await getOrCreateCart(req.user?._id, sessionId);
    cart.coupon = undefined;
    await cart.save();
    cart = await Cart.findById(cart._id).populate('items.product', 'name slug price images stock prices');
    res.json(new ApiResponse(200, cart, 'Coupon removed'));
  } catch (error) {
    next(error);
  }
};
