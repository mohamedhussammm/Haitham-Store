const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
    res.json(new ApiResponse(200, categories));
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:slug
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) throw ApiError.notFound('Category not found');
    res.json(new ApiResponse(200, category));
  } catch (error) {
    next(error);
  }
};

// POST /api/categories (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(new ApiResponse(201, category, 'Category created'));
  } catch (error) {
    next(error);
  }
};

// PUT /api/categories/:id (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) throw ApiError.notFound('Category not found');
    res.json(new ApiResponse(200, category, 'Category updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/categories/:id (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw ApiError.notFound('Category not found');
    res.json(new ApiResponse(200, null, 'Category deleted'));
  } catch (error) {
    next(error);
  }
};
