const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const {
  getProducts, getProduct, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, getAllProductsAdmin,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

// Multer config for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// Public routes
router.get('/', getProducts);
router.get('/related/:slug', getRelatedProducts);
router.get('/:slug', getProduct);

// Admin routes
router.get('/admin/all', protect, admin, getAllProductsAdmin);
router.post('/', protect, admin, upload.array('images', 5), createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
