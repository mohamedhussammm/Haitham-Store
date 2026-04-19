const router = require('express').Router();
const {
  checkout, getMyOrders, getOrder,
  getAllOrders, updateOrderStatus, deleteOrder, getOrderStats,
} = require('../controllers/orderController');
const { protect, admin, optionalAuth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { checkoutSchema } = require('../validators/orderValidator');

// Public / Guest checkout
router.post('/', optionalAuth, validate(checkoutSchema), checkout);

// Authenticated user routes
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);

// Admin routes
router.get('/admin/all', protect, admin, getAllOrders);
router.get('/admin/stats', protect, admin, getOrderStats);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
