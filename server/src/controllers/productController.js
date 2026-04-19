const Product = require('../models/Product');
const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, sort, search, minPrice, maxPrice } = req.query;
    const query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'name') sortOption = { name: 1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(query),
    ]);

    res.json(new ApiResponse(200, {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:slug
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug')
      .populate('bundleItems', 'name slug price images');
    if (!product) throw ApiError.notFound('Product not found');
    res.json(new ApiResponse(200, product));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/related/:slug
exports.getRelatedProducts = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) throw ApiError.notFound('Product not found');

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    }).limit(4).lean();

    res.json(new ApiResponse(200, related));
  } catch (error) {
    next(error);
  }
};

// POST /api/products (Admin)
exports.createProduct = async (req, res, next) => {
  try {
    // Handle image uploads from req.files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push({ url: `/uploads/${file.filename}`, alt: req.body.name });
      });
    }
    if (req.body.imageUrls) {
      const urls = Array.isArray(req.body.imageUrls) ? req.body.imageUrls : [req.body.imageUrls];
      urls.forEach((url) => images.push({ url, alt: req.body.name }));
    }

    const productData = { ...req.body };
    if (images.length > 0) productData.images = images;

    // Parse arrays if sent as strings
    if (typeof productData.highlights === 'string') {
      productData.highlights = JSON.parse(productData.highlights);
    }
    if (typeof productData.uses === 'string') {
      productData.uses = JSON.parse(productData.uses);
    }

    const product = await Product.create(productData);
    res.status(201).json(new ApiResponse(201, product, 'Product created'));
  } catch (error) {
    next(error);
  }
};

// PUT /api/products/:id (Admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw ApiError.notFound('Product not found');

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        alt: req.body.name || product.name,
      }));
      req.body.images = [...(product.images || []), ...newImages];
    }

    if (typeof req.body.highlights === 'string') {
      req.body.highlights = JSON.parse(req.body.highlights);
    }
    if (typeof req.body.uses === 'string') {
      req.body.uses = JSON.parse(req.body.uses);
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(new ApiResponse(200, product, 'Product updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/products/:id (Admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw ApiError.notFound('Product not found');
    await product.deleteOne();
    res.json(new ApiResponse(200, null, 'Product deleted'));
  } catch (error) {
    next(error);
  }
};

// GET /api/products/admin/all (Admin - includes inactive)
exports.getAllProductsAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(query),
    ]);
    res.json(new ApiResponse(200, {
      products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    }));
  } catch (error) {
    next(error);
  }
};
