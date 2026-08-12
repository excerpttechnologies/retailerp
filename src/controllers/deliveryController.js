const asyncHandler = require('express-async-handler');
const Delivery = require('../models/Delivery');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createDelivery = asyncHandler(async (req, res) => {
  const { sale, vehicle, driverName, address, notes } = req.body;
  if (!sale || !address) {
    res.status(400);
    throw new Error('sale and address are required');
  }
  const deliveryPayload = {
    company: scopeCompany(req),
    sale,
    vehicle,
    driverName,
    address,
    notes,
    createdBy: req.user._id,
  };
  if (req.file) {
    deliveryPayload.proofOfDelivery = `/uploads/documents/${req.file.filename}`;
  }
  const delivery = await Delivery.create(deliveryPayload);
  res.status(201).json({ success: true, delivery });
});

const getDeliveries = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Delivery.find(query).populate('sale', 'invoiceNumber grandTotal').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Delivery.countDocuments(query),
  ]);
  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const delivery = await Delivery.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!delivery) {
    res.status(404);
    throw new Error('Delivery not found');
  }
  delivery.status = status;
  if (status === 'dispatched') delivery.dispatchedAt = new Date();
  if (status === 'delivered') delivery.deliveredAt = new Date();
  if (req.file) delivery.proofOfDelivery = `/uploads/documents/${req.file.filename}`;
  await delivery.save();
  res.json({ success: true, delivery });
});

module.exports = { createDelivery, getDeliveries, updateDeliveryStatus };
