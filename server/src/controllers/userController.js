const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/users (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(query),
    ]);
    res.json(new ApiResponse(200, {
      users,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    }));
  } catch (error) {
    next(error);
  }
};

// PUT /api/users/:id (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, role, isActive, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { firstName, lastName, email, role, isActive, phone }, { new: true, runValidators: true });
    if (!user) throw ApiError.notFound('User not found');
    res.json(new ApiResponse(200, user, 'User updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/users/:id (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      throw ApiError.badRequest('You cannot delete your own account');
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw ApiError.notFound('User not found');
    res.json(new ApiResponse(200, null, 'User deleted'));
  } catch (error) {
    next(error);
  }
};
