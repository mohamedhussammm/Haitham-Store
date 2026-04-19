const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// POST /api/orders (Checkout)
exports.checkout = async (req, res, next) => {
  try {
    const { contact, shippingAddress, billingAddress, paymentMethod, currency = 'JOD', couponCode, saveInfo, notes } = req.body;
    const sessionId = req.cookies.sessionId || req.headers['x-session-id'];

    // 1. Get cart
    let cart;
    if (req.user) {
      cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    } else {
      cart = await Cart.findOne({ sessionId }).populate('items.product');
    }
    if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

    // 2. Validate stock & build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product) throw ApiError.badRequest(`Product not found`);
      if (product.stock < item.quantity) throw ApiError.badRequest(`${product.name} is out of stock`);

      const priceKey = currency === 'EGP' ? 'EGP' : 'JOD';
      const price = product.prices?.[priceKey] || product.price;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price,
        quantity: item.quantity,
      });
    }

    // 3. Calculate totals
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const freeShippingThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD) || 30;
    const shippingRate = Number(process.env.SHIPPING_COST) || 2;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : shippingRate;
    const taxRate = Number(process.env.TAX_RATE) || 16;
    const tax = (subtotal * taxRate) / (100 + taxRate); // Tax inclusive

    // 4. Apply coupon if provided
    let discount = 0;
    let couponData = {};
    if (couponCode || cart.coupon?.code) {
      const code = couponCode || cart.coupon.code;
      const coupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (coupon) {
        const validation = coupon.isValid(subtotal);
        if (validation.valid) {
          discount = coupon.calculateDiscount(subtotal);
          couponData = { code: coupon.code, discount };
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const total = subtotal + shippingCost - discount;

    // 5. Create order
    const order = await Order.create({
      user: req.user?._id,
      contact,
      shippingAddress,
      billingAddress: billingAddress || { sameAsShipping: true },
      items: orderItems,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      currency,
      shippingMethod: { name: 'Standard Shipping', cost: shippingCost },
      paymentMethod: { type: 'cod', status: 'pending' },
      coupon: couponData,
      status: 'confirmed',
      saveInfo,
      notes,
    });

    // 6. Decrement stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    // 7. Clear cart
    cart.items = [];
    cart.coupon = undefined;
    await cart.save();

    // 8. Populate and return
    const populatedOrder = await Order.findById(order._id).populate('items.product', 'name slug images');

    res.status(201).json(new ApiResponse(201, populatedOrder, 'Order placed successfully'));
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(new ApiResponse(200, orders));
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name slug images');
    if (!order) throw ApiError.notFound('Order not found');

    // Only allow owner or admin
    if (req.user.role !== 'admin' && order.user?.toString() !== req.user._id.toString()) {
      throw ApiError.forbidden('Not authorized');
    }

    res.json(new ApiResponse(200, order));
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/admin/all (Admin)
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'contact.email': { $regex: search, $options: 'i' } },
        { 'shippingAddress.firstName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.lastName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'firstName lastName email').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(query),
    ]);

    res.json(new ApiResponse(200, {
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    }));
  } catch (error) {
    next(error);
  }
};

// PUT /api/orders/:id/status (Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) throw ApiError.badRequest('Invalid status');

    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');

    // If cancelling, restore stock
    if (status === 'cancelled' && order.status !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
    }

    // If delivered, mark payment as paid (COD)
    if (status === 'delivered') {
      order.paymentMethod.status = 'paid';
    }

    order.status = status;
    await order.save();

    res.json(new ApiResponse(200, order, `Order status updated to ${status}`));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/orders/:id (Admin)
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw ApiError.notFound('Order not found');
    await order.deleteOne();
    res.json(new ApiResponse(200, null, 'Order deleted'));
  } catch (error) {
    next(error);
  }
};

// GET /api/orders/admin/stats (Admin dashboard)
exports.getOrderStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      revenueAgg,
      monthlyAgg,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.countDocuments({ status: 'cancelled' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' }, avgOrder: { $avg: '$total' } } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 12 },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'firstName lastName').lean(),
    ]);

    res.json(new ApiResponse(200, {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue: revenueAgg[0]?.total || 0,
      averageOrder: revenueAgg[0]?.avgOrder || 0,
      monthlyRevenue: monthlyAgg,
      recentOrders,
    }));
  } catch (error) {
    next(error);
  }
};
