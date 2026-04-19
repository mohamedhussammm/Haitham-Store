const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Expense title is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  currency: {
    type: String,
    enum: ['EGP', 'JOD'],
    default: 'JOD',
  },
  category: {
    type: String,
    enum: ['shipping', 'marketing', 'inventory', 'operations', 'salaries', 'utilities', 'other'],
    required: true,
  },
  description: {
    type: String,
    maxlength: 1000,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

expenseSchema.index({ date: -1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
