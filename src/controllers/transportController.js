const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Transport = require('../models/Transport');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

/**
 * Get all transport/logistic records
 * @route GET /api/logistic/delivery
 * @access Private
 */
const getTransportList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, transporter, bookingDelay, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const query = { company: scopeCompany(req) };

  // Apply filters if provided
  if (transporter) {
    query.transporter = { $regex: transporter, $options: 'i' };
  }
  if (bookingDelay) {
    query.bookingDelay = { $regex: bookingDelay, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [data, total] = await Promise.all([
    Transport.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email'),
    Transport.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * Get single transport/logistic record
 * @route GET /api/logistic/delivery/:id
 * @access Private
 */
const getTransportById = asyncHandler(async (req, res) => {
  const transport = await Transport.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  }).populate('createdBy', 'name email');

  if (!transport) {
    res.status(404);
    throw new Error('Transport record not found');
  }

  res.json({ success: true, data: transport });
});

/**
 * Create a new transport/logistic record
 * @route POST /api/logistic/delivery
 * @access Private
 */
const createTransport = asyncHandler(async (req, res) => {
  const {
    transactionNo,
    transactionDate,
    transporter,
    lrNumber,
    bookingDate,
    bookingDelay,
    supplierName,
    invNumber,
    parcelQty,
    value,
    freight,
    autoCharges,
    tips,
    tipsType,
    gstApplicable,
    notes,
  } = req.body;

  // Validation
  if (!transactionNo || !transporter || !lrNumber || !supplierName || !invNumber) {
    res.status(400);
    throw new Error('transactionNo, transporter, lrNumber, supplierName, and invNumber are required');
  }

  // Check if transactionNo already exists for this company
  const existingTransport = await Transport.findOne({
    company: scopeCompany(req),
    transactionNo,
  });

  if (existingTransport) {
    res.status(409);
    throw new Error(`Transaction number ${transactionNo} already exists`);
  }

  const transportPayload = {
    company: scopeCompany(req),
    transactionNo,
    transactionDate: new Date(transactionDate),
    transporter,
    lrNumber,
    bookingDate: new Date(bookingDate),
    bookingDelay,
    supplierName,
    invNumber,
    parcelQty: Number(parcelQty) || 0,
    value: Number(value) || 0,
    freight: freight || {},
    autoCharges: Number(autoCharges) || 0,
    tips: Number(tips) || 0,
    tipsType,
    gstApplicable: Boolean(gstApplicable),
    notes,
    createdBy: req.user._id,
  };

  const transport = await Transport.create(transportPayload);
  await transport.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Transport record created successfully',
    data: transport,
  });
});

/**
 * Update transport/logistic record
 * @route PUT /api/logistic/delivery/:id
 * @access Private
 */
const updateTransport = asyncHandler(async (req, res) => {
  const {
    transactionDate,
    transporter,
    lrNumber,
    bookingDate,
    bookingDelay,
    supplierName,
    invNumber,
    parcelQty,
    value,
    freight,
    autoCharges,
    tips,
    tipsType,
    gstApplicable,
    notes,
  } = req.body;

  const transport = await Transport.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  });

  if (!transport) {
    res.status(404);
    throw new Error('Transport record not found');
  }

  // Update fields
  if (transactionDate !== undefined) transport.transactionDate = new Date(transactionDate);
  if (transporter !== undefined) transport.transporter = transporter;
  if (lrNumber !== undefined) transport.lrNumber = lrNumber;
  if (bookingDate !== undefined) transport.bookingDate = new Date(bookingDate);
  if (bookingDelay !== undefined) transport.bookingDelay = bookingDelay;
  if (supplierName !== undefined) transport.supplierName = supplierName;
  if (invNumber !== undefined) transport.invNumber = invNumber;
  if (parcelQty !== undefined) transport.parcelQty = Number(parcelQty);
  if (value !== undefined) transport.value = Number(value);
  if (freight !== undefined) transport.freight = freight;
  if (autoCharges !== undefined) transport.autoCharges = Number(autoCharges);
  if (tips !== undefined) transport.tips = Number(tips);
  if (tipsType !== undefined) transport.tipsType = tipsType;
  if (gstApplicable !== undefined) transport.gstApplicable = Boolean(gstApplicable);
  if (notes !== undefined) transport.notes = notes;

  await transport.save();
  await transport.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Transport record updated successfully',
    data: transport,
  });
});

/**
 * Delete transport/logistic record
 * @route DELETE /api/logistic/delivery/:id
 * @access Private
 */
const deleteTransport = asyncHandler(async (req, res) => {
  const transport = await Transport.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  });

  if (!transport) {
    res.status(404);
    throw new Error('Transport record not found');
  }

  await Transport.deleteOne({ _id: transport._id });

  res.json({
    success: true,
    message: 'Transport record deleted successfully',
    data: transport,
  });
});

/**
 * Get transport statistics/summary
 * @route GET /api/logistic/delivery/stats/summary
 * @access Private
 */
const getTransportStats = asyncHandler(async (req, res) => {
  const company = scopeCompany(req);

  const stats = await Transport.aggregate([
    { $match: { company: mongoose.Types.ObjectId(company) } },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        totalValue: { $sum: '$value' },
        totalFreight: { $sum: '$freight.totalFreight' },
        totalAutoCharges: { $sum: '$autoCharges' },
        totalTips: { $sum: '$tips' },
        avgValue: { $avg: '$value' },
      },
    },
  ]);

  const summary = stats[0] || {
    totalRecords: 0,
    totalValue: 0,
    totalFreight: 0,
    totalAutoCharges: 0,
    totalTips: 0,
    avgValue: 0,
  };

  res.json({ success: true, data: summary });
});

module.exports = {
  getTransportList,
  getTransportById,
  createTransport,
  updateTransport,
  deleteTransport,
  getTransportStats,
};
