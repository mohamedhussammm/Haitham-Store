const router = require('express').Router();
const {
  getExpenses, getExpenseStats, createExpense, updateExpense, deleteExpense,
} = require('../controllers/expenseController');
const { protect, admin } = require('../middleware/auth');

router.use(protect, admin);

router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

module.exports = router;
