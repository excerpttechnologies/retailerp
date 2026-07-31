const asyncHandler = require('express-async-handler');
const Warranty = require('../models/Warranty');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createWarranty = asyncHandler(async (req, res) => {
  const { product, customer, sale, serialNumber, purchaseDate, warrantyMonths, notes } = req.body;
  if (!product || !customer || !purchaseDate) {
    res.status(400);
    throw new Error('product, customer and purchaseDate are required');
  }
  const months = Number(warrantyMonths) || 12;
  const expiryDate = new Date(purchaseDate);
  expiryDate.setMonth(expiryDate.getMonth() + months);

  const warranty = await Warranty.create({
    company: scopeCompany(req), product, customer, sale, serialNumber, purchaseDate,
    warrantyMonths: months, expiryDate, notes, createdBy: req.user._id,
  });
  res.status(201).json({ success: true, warranty });
});

const getWarranties = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  let records = await Warranty.find(query).populate('product', 'name sku').populate('customer', 'name phone').sort({ createdAt: -1 });

  // Auto-flag expired warranties on read (keeps status accurate without a cron job)
  const now = new Date();
  records = records.map((w) => {
    if (w.status === 'active' && w.expiryDate < now) w.status = 'expired';
    return w;
  });

  if (search) {
    const q = search.toLowerCase();
    records = records.filter((w) => (w.serialNumber || '').toLowerCase().includes(q) || w.product?.name?.toLowerCase().includes(q));
  }

  const total = records.length;
  const paged = records.slice((Number(page) - 1) * Number(limit), (Number(page) - 1) * Number(limit) + Number(limit));

  res.json({ success: true, data: paged, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

module.exports = { createWarranty, getWarranties };
