const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createPayment = asyncHandler(async (req, res) => {
  const { type, amount, method, referenceType, referenceId, referenceLabel, paymentDate, notes } = req.body;
  if (!type || !amount) {
    res.status(400);
    throw new Error('type and amount are required');
  }
  const payment = await Payment.create({
    company: scopeCompany(req), type, amount, method, referenceType, referenceId, referenceLabel,
    paymentDate: paymentDate || Date.now(), notes, createdBy: req.user._id,
  });
  res.status(201).json({ success: true, payment });
});

const getPayments = asyncHandler(async (req, res) => {
  const { type, from, to, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (type) query.type = type;
  if (from || to) {
    query.paymentDate = {};
    if (from) query.paymentDate.$gte = new Date(from);
    if (to) query.paymentDate.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total, receivedAgg, madeAgg] = await Promise.all([
    Payment.find(query).sort({ paymentDate: -1 }).skip(skip).limit(Number(limit)),
    Payment.countDocuments(query),
    Payment.aggregate([{ $match: { ...query, type: 'received' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Payment.aggregate([{ $match: { ...query, type: 'made' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
  ]);

  res.json({
    success: true, data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    summary: { totalReceived: receivedAgg[0]?.total || 0, totalMade: madeAgg[0]?.total || 0 },
  });
});

const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!payment) {
    res.status(404);
    throw new Error('Payment not found');
  }
  res.json({ success: true, message: 'Payment entry deleted' });
});

module.exports = { createPayment, getPayments, deletePayment };
