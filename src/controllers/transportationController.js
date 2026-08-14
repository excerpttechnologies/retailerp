const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Transportation = require('../models/Transportation');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

/**
 * Get all transportation records
 * @route GET /api/transportation
 * @access Private
 */
const getTransportationList = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, modeOfPayment, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
  const query = { company: scopeCompany(req) };

  // Apply filters if provided
  if (status) {
    query.status = status;
  }
  if (modeOfPayment) {
    query.modeOfPayment = modeOfPayment;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const sortObj = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [data, total] = await Promise.all([
    Transportation.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name email'),
    Transportation.countDocuments(query),
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
 * Get single transportation record
 * @route GET /api/transportation/:id
 * @access Private
 */
const getTransportationById = asyncHandler(async (req, res) => {
  const transportation = await Transportation.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  }).populate('createdBy', 'name email');

  if (!transportation) {
    res.status(404);
    throw new Error('Transportation record not found');
  }

  res.json({ success: true, data: transportation });
});

/**
 * Create a new transportation record
 * @route POST /api/transportation
 * @access Private
 */
const createTransportation = asyncHandler(async (req, res) => {
  const {
    transporterName,
    transporterGSTIN,
    transporterSACCode,
    bookingNumber,
    bookingDate,
    deliveryDate,
    invoiceNumber,
    invoiceValue,
    origin,
    destination,
    descriptionOfGoods,
    numberOfParcels,
    weightKgs,
    freightCharges,
    otherCharges,
    sgst,
    cgst,
    sgstAmount,
    cgstAmount,
    roundOff,
    totalAmount,
    modeOfPayment,
    status,
    proofOfDelivery,
    remarks,
  } = req.body;

  // Validation
  if (!transporterName || !bookingNumber || !origin || !destination || !descriptionOfGoods) {
    res.status(400);
    throw new Error('transporterName, bookingNumber, origin, destination, and descriptionOfGoods are required');
  }

  const transportationPayload = {
    company: scopeCompany(req),
    transporterName,
    transporterGSTIN,
    transporterSACCode,
    bookingNumber,
    bookingDate: new Date(bookingDate),
    deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
    invoiceNumber,
    invoiceValue: Number(invoiceValue) || 0,
    origin,
    destination,
    descriptionOfGoods,
    numberOfParcels: Number(numberOfParcels) || 1,
    weightKgs: Number(weightKgs) || 0,
    freightCharges: Number(freightCharges) || 0,
    otherCharges: Number(otherCharges) || 0,
    sgst: Number(sgst) || 9,
    cgst: Number(cgst) || 9,
    sgstAmount: Number(sgstAmount) || 0,
    cgstAmount: Number(cgstAmount) || 0,
    roundOff: Number(roundOff) || 0,
    totalAmount: Number(totalAmount) || 0,
    modeOfPayment: modeOfPayment || 'TO PAY',
    status: status || 'PENDING',
    proofOfDelivery,
    remarks,
    createdBy: req.user._id,
  };

  const transportation = await Transportation.create(transportationPayload);
  await transportation.populate('createdBy', 'name email');

  res.status(201).json({
    success: true,
    message: 'Transportation record created successfully',
    data: transportation,
  });
});

/**
 * Update transportation record
 * @route PUT /api/transportation/:id
 * @access Private
 */
const updateTransportation = asyncHandler(async (req, res) => {
  const {
    transporterName,
    transporterGSTIN,
    transporterSACCode,
    bookingNumber,
    bookingDate,
    deliveryDate,
    invoiceNumber,
    invoiceValue,
    origin,
    destination,
    descriptionOfGoods,
    numberOfParcels,
    weightKgs,
    freightCharges,
    otherCharges,
    sgst,
    cgst,
    sgstAmount,
    cgstAmount,
    roundOff,
    totalAmount,
    modeOfPayment,
    status,
    proofOfDelivery,
    remarks,
  } = req.body;

  const transportation = await Transportation.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  });

  if (!transportation) {
    res.status(404);
    throw new Error('Transportation record not found');
  }

  // Update fields
  if (transporterName !== undefined) transportation.transporterName = transporterName;
  if (transporterGSTIN !== undefined) transportation.transporterGSTIN = transporterGSTIN;
  if (transporterSACCode !== undefined) transportation.transporterSACCode = transporterSACCode;
  if (bookingNumber !== undefined) transportation.bookingNumber = bookingNumber;
  if (bookingDate !== undefined) transportation.bookingDate = new Date(bookingDate);
  if (deliveryDate !== undefined) transportation.deliveryDate = deliveryDate ? new Date(deliveryDate) : null;
  if (invoiceNumber !== undefined) transportation.invoiceNumber = invoiceNumber;
  if (invoiceValue !== undefined) transportation.invoiceValue = Number(invoiceValue);
  if (origin !== undefined) transportation.origin = origin;
  if (destination !== undefined) transportation.destination = destination;
  if (descriptionOfGoods !== undefined) transportation.descriptionOfGoods = descriptionOfGoods;
  if (numberOfParcels !== undefined) transportation.numberOfParcels = Number(numberOfParcels);
  if (weightKgs !== undefined) transportation.weightKgs = Number(weightKgs);
  if (freightCharges !== undefined) transportation.freightCharges = Number(freightCharges);
  if (otherCharges !== undefined) transportation.otherCharges = Number(otherCharges);
  if (sgst !== undefined) transportation.sgst = Number(sgst);
  if (cgst !== undefined) transportation.cgst = Number(cgst);
  if (sgstAmount !== undefined) transportation.sgstAmount = Number(sgstAmount);
  if (cgstAmount !== undefined) transportation.cgstAmount = Number(cgstAmount);
  if (roundOff !== undefined) transportation.roundOff = Number(roundOff);
  if (totalAmount !== undefined) transportation.totalAmount = Number(totalAmount);
  if (modeOfPayment !== undefined) transportation.modeOfPayment = modeOfPayment;
  if (status !== undefined) transportation.status = status;
  if (proofOfDelivery !== undefined) transportation.proofOfDelivery = proofOfDelivery;
  if (remarks !== undefined) transportation.remarks = remarks;

  await transportation.save();
  await transportation.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Transportation record updated successfully',
    data: transportation,
  });
});

/**
 * Delete transportation record
 * @route DELETE /api/transportation/:id
 * @access Private
 */
const deleteTransportation = asyncHandler(async (req, res) => {
  const transportation = await Transportation.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  });

  if (!transportation) {
    res.status(404);
    throw new Error('Transportation record not found');
  }

  await Transportation.deleteOne({ _id: transportation._id });

  res.json({
    success: true,
    message: 'Transportation record deleted successfully',
    data: transportation,
  });
});

/**
 * Get transportation statistics
 * @route GET /api/transportation/stats/summary
 * @access Private
 */
const getTransportationStats = asyncHandler(async (req, res) => {
  const company = scopeCompany(req);

  const stats = await Transportation.aggregate([
    { $match: { company: mongoose.Types.ObjectId(company) } },
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        totalFreight: { $sum: '$freightCharges' },
        totalOtherCharges: { $sum: '$otherCharges' },
        avgFreight: { $avg: '$freightCharges' },
        pendingCount: {
          $sum: { $cond: [{ $eq: ['$status', 'PENDING'] }, 1, 0] },
        },
        deliveredCount: {
          $sum: { $cond: [{ $eq: ['$status', 'DELIVERED'] }, 1, 0] },
        },
        toPayCount: {
          $sum: { $cond: [{ $eq: ['$modeOfPayment', 'TO PAY'] }, 1, 0] },
        },
      },
    },
  ]);

  const summary = stats[0] || {
    totalRecords: 0,
    totalAmount: 0,
    totalFreight: 0,
    totalOtherCharges: 0,
    avgFreight: 0,
    pendingCount: 0,
    deliveredCount: 0,
    toPayCount: 0,
  };

  res.json({ success: true, data: summary });
});

/**
 * Update transportation status
 * @route PATCH /api/transportation/:id/status
 * @access Private
 */
const updateTransportationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status provided');
  }

  const transportation = await Transportation.findOne({
    _id: req.params.id,
    company: scopeCompany(req),
  });

  if (!transportation) {
    res.status(404);
    throw new Error('Transportation record not found');
  }

  transportation.status = status;
  if (status === 'DELIVERED' && !transportation.deliveryDate) {
    transportation.deliveryDate = new Date();
  }

  await transportation.save();
  await transportation.populate('createdBy', 'name email');

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: transportation,
  });
});

module.exports = {
  getTransportationList,
  getTransportationById,
  createTransportation,
  updateTransportation,
  deleteTransportation,
  getTransportationStats,
  updateTransportationStatus,
};
