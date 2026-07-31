const asyncHandler = require('express-async-handler');
const Expense = require('../models/Expense');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createExpense = asyncHandler(async (req, res) => {
  const { title, category, amount, paidTo, paymentMethod, expenseDate, notes, status } = req.body;
  if (!title || !category || !amount) {
    res.status(400);
    throw new Error('title, category and amount are required');
  }
  const attachment = req.file ? `/uploads/documents/${req.file.filename}` : null;

  const expense = await Expense.create({
    company: scopeCompany(req), title, category, amount, paidTo, paymentMethod,
    expenseDate: expenseDate || Date.now(), attachment, notes, status, createdBy: req.user._id,
  });

  await logAudit({ company: scopeCompany(req), user: req.user, module: 'expenses', action: 'create', recordId: expense._id, summary: `Recorded expense: ${title}` });
  res.status(201).json({ success: true, expense });
});

const getExpenses = asyncHandler(async (req, res) => {
  const { search, category, from, to, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };
  if (from || to) {
    query.expenseDate = {};
    if (from) query.expenseDate.$gte = new Date(from);
    if (to) query.expenseDate.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total, totalAmountAgg] = await Promise.all([
    Expense.find(query).sort({ expenseDate: -1 }).skip(skip).limit(Number(limit)),
    Expense.countDocuments(query),
    Expense.aggregate([{ $match: query }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  res.json({
    success: true, data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    totalAmount: totalAmountAgg[0]?.total || 0,
  });
});

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  const fields = ['title', 'category', 'amount', 'paidTo', 'paymentMethod', 'expenseDate', 'notes', 'status'];
  fields.forEach((f) => { if (req.body[f] !== undefined) expense[f] = req.body[f]; });
  if (req.file) expense.attachment = `/uploads/documents/${req.file.filename}`;
  await expense.save();
  res.json({ success: true, expense });
});

const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!expense) {
    res.status(404);
    throw new Error('Expense not found');
  }
  res.json({ success: true, message: 'Expense deleted' });
});

module.exports = { createExpense, getExpenses, updateExpense, deleteExpense };
