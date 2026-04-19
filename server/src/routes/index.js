const router = require('express').Router();

router.use('/auth', require('./authRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/categories', require('./categoryRoutes'));
router.use('/cart', require('./cartRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/coupons', require('./couponRoutes'));
router.use('/expenses', require('./expenseRoutes'));
router.use('/users', require('./userRoutes'));

module.exports = router;
