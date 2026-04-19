const Expense = require('../models/Expense');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// GET /api/expenses
exports.getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, category, startDate, endDate } = req.query;
    const query = {};
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [expenses, total] = await Promise.all([
      Expense.find(query).populate('createdBy', 'firstName lastName').sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
      Expense.countDocuments(query),
    ]);

    res.json(new ApiResponse(200, {
      expenses,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/stats
exports.getExpenseStats = async (req, res, next) => {
  try {
    const [totalAgg, byCategoryAgg, monthlyAgg] = await Promise.all([
      Expense.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
      Expense.aggregate([
        { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
      Expense.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$date' } },
            total: { $sum: '$amount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: -1 } },
        { $limit: 12 },
      ]),
    ]);

    res.json(new ApiResponse(200, {
      totalExpenses: totalAgg[0]?.total || 0,
      byCategory: byCategoryAgg,
      monthly: monthlyAgg,
    }));
  } catch (error) {
    next(error);
  }
};

// POST /api/expenses
exports.createExpense = async (req, res, next) => {
  try {
    const expense = await Expense.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(new ApiResponse(201, expense, 'Expense created'));
  } catch (error) {
    next(error);
  }
};

// PUT /api/expenses/:id
exports.updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!expense) throw ApiError.notFound('Expense not found');
    res.json(new ApiResponse(200, expense, 'Expense updated'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/expenses/:id
exports.deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) throw ApiError.notFound('Expense not found');
    res.json(new ApiResponse(200, null, 'Expense deleted'));
  } catch (error) {
    next(error);
  }
};
