const router = require('express').Router();
const {
  getCart, addToCart, updateCartItem, removeCartItem,
  clearCart, applyCoupon, removeCoupon,
} = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { addToCartSchema, updateCartSchema, applyCouponSchema } = require('../validators/orderValidator');

// All cart routes use optional auth (supports guest)
router.use(optionalAuth);

router.get('/', getCart);
router.post('/add', validate(addToCartSchema), addToCart);
router.put('/update/:itemId', validate(updateCartSchema), updateCartItem);
router.delete('/remove/:itemId', removeCartItem);
router.delete('/clear', clearCart);
router.post('/apply-coupon', validate(applyCouponSchema), applyCoupon);
router.delete('/remove-coupon', removeCoupon);

module.exports = router;
