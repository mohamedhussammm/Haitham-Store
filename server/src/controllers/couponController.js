const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// POST /api/coupons/validate
exports.validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) throw ApiError.notFound('Invalid coupon code');

    const validation = coupon.isValid(0);
    if (!validation.valid) throw ApiError.badRequest(validation.message);

    res.json(new ApiResponse(200, {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase,
    }, 'Coupon is valid'));
  } catch (error) {
    next(error);
  }
};

// GET /api/coupons (Admin)
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    res.json(new ApiResponse(200, coupons));
  } catch (error) {
    next(error);
  }
};

// POST /api/coupons (Admin)
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(new ApiResponse(201, coupon, 'Coupon created'));
  } catch (error) {
    next(error);
  }
};

// PUT /api/coupons/:id (Admin)
exports.updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!coupon) throw ApiError.notFound('Coupon not found');
    res.json(new ApiResponse(200, coupon, 'Coupon updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/coupons/:id (Admin)
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw ApiError.notFound('Coupon not found');
    res.json(new ApiResponse(200, null, 'Coupon deleted'));
  } catch (error) {
    next(error);
  }
};
