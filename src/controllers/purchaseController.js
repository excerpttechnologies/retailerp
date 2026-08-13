const asyncHandler = require('express-async-handler');
const PurchaseDelivery = require('../models/PurchaseDelivery');
const PurchaseGoods = require('../models/PurchaseGoods');
const PurchaseBarcode = require('../models/PurchaseBarcode');
const PurchaseReturn = require('../models/PurchaseReturn');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const listQuery = (Model, req, query = {}) => {
  const { page = 1, limit = 20, search = '' } = req.query;
  const safeLimit = Number(limit) || 20;
  const skip = (Number(page) - 1) * safeLimit;
  const baseQuery = { company: scopeCompany(req), ...query };

  if (search) {
    baseQuery.$or = [
      { invoiceNo: { $regex: search, $options: 'i' } },
      { supplier: { $regex: search, $options: 'i' } },
      { poNumber: { $regex: search, $options: 'i' } },
      { returnNo: { $regex: search, $options: 'i' } },
      { refNo: { $regex: search, $options: 'i' } },
    ];
  }

  return { baseQuery, skip, safeLimit };
};

const getDeliveryRecords = asyncHandler(async (req, res) => {
  const { baseQuery, skip, safeLimit } = listQuery(PurchaseDelivery, req);
  const [items, total] = await Promise.all([
    PurchaseDelivery.find(baseQuery).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    PurchaseDelivery.countDocuments(baseQuery),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(req.query.page || 1), limit: safeLimit, pages: Math.ceil(total / safeLimit) || 1 } });
});

const getDeliveryRecordById = asyncHandler(async (req, res) => {
  const record = await PurchaseDelivery.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Delivery record not found');
  }
  res.json({ success: true, record });
});

const createDeliveryRecord = asyncHandler(async (req, res) => {
  const freightInput = req.body.freight || {};
  const tipsInput = req.body.tips || {};
  const freightAmount = Number(freightInput.amount ?? req.body.freightAmount ?? 0);
  const tipsAmount = Number(tipsInput.amount ?? req.body.tips ?? 0);

  const payload = {
    ...req.body,
    company: scopeCompany(req),
    createdBy: req.user._id,
    items: req.body.items || [],
    subTotal: Number(req.body.subTotal || 0),
    taxAmount: Number(req.body.taxAmount || 0),
    grandTotal: Number(req.body.grandTotal || 0),
    totalAmount: Number(req.body.totalAmount || req.body.grandTotal || 0),
    freightAmount,
    freight: {
      carrierName: freightInput.carrierName || '',
      amount: freightAmount,
      mode: freightInput.mode || 'Road',
      lrNumber: freightInput.lrNumber || '',
      lrDate: freightInput.lrDate || null,
    },
    tips: {
      amount: tipsAmount,
      remarks: tipsInput.remarks || '',
    },
  };

  const record = await PurchaseDelivery.create(payload);
  res.status(201).json({ success: true, record });
});

const getGoodsPurchaseRecords = asyncHandler(async (req, res) => {
  const { baseQuery, skip, safeLimit } = listQuery(PurchaseGoods, req);
  const [items, total] = await Promise.all([
    PurchaseGoods.find(baseQuery).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    PurchaseGoods.countDocuments(baseQuery),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(req.query.page || 1), limit: safeLimit, pages: Math.ceil(total / safeLimit) || 1 } });
});

const getGoodsPurchaseRecordById = asyncHandler(async (req, res) => {
  const record = await PurchaseGoods.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Goods purchase not found');
  }
  res.json({ success: true, record });
});

const createGoodsPurchaseRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseGoods.create({
    ...req.body,
    company: scopeCompany(req),
    createdBy: req.user._id,
    grandTotal: Number(req.body.grandTotal || 0),
    items: req.body.items || [],
  });
  res.status(201).json({ success: true, record });
});

const updateDeliveryRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseDelivery.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Delivery record not found');
  }

  const freightInput = req.body.freight || record.freight || {};
  const tipsInput = req.body.tips || record.tips || {};
  const freightAmount = Number(freightInput.amount ?? req.body.freightAmount ?? record.freightAmount ?? 0);
  const tipsAmount = Number(tipsInput.amount ?? req.body.tips ?? (typeof record.tips === 'number' ? record.tips : record.tips?.amount ?? 0));

  Object.assign(record, {
    ...req.body,
    items: req.body.items || record.items,
    subTotal: Number(req.body.subTotal || record.subTotal || 0),
    taxAmount: Number(req.body.taxAmount || record.taxAmount || 0),
    grandTotal: Number(req.body.grandTotal || record.grandTotal || 0),
    totalAmount: Number(req.body.totalAmount || record.totalAmount || 0),
    freightAmount,
    freight: {
      carrierName: freightInput.carrierName || record.freight?.carrierName || '',
      amount: freightAmount,
      mode: freightInput.mode || record.freight?.mode || 'Road',
      lrNumber: freightInput.lrNumber || record.freight?.lrNumber || '',
      lrDate: freightInput.lrDate || record.freight?.lrDate || null,
    },
    tips: {
      amount: tipsAmount,
      remarks: tipsInput.remarks || record.tips?.remarks || '',
    },
  });
  await record.save();
  res.json({ success: true, record });
});

const deleteDeliveryRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseDelivery.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Delivery record not found');
  }
  res.json({ success: true, message: 'Delivery record deleted' });
});

const updateGoodsPurchaseRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseGoods.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Goods purchase not found');
  }

  Object.assign(record, { ...req.body, grandTotal: Number(req.body.grandTotal || record.grandTotal), items: req.body.items || record.items });
  await record.save();
  res.json({ success: true, record });
});

const deleteGoodsPurchaseRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseGoods.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Goods purchase not found');
  }
  res.json({ success: true, message: 'Goods purchase deleted' });
});

const getBarcodeRecords = asyncHandler(async (req, res) => {
  const { baseQuery, skip, safeLimit } = listQuery(PurchaseBarcode, req);
  const [items, total] = await Promise.all([
    PurchaseBarcode.find(baseQuery).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    PurchaseBarcode.countDocuments(baseQuery),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(req.query.page || 1), limit: safeLimit, pages: Math.ceil(total / safeLimit) || 1 } });
});

const getBarcodeRecordById = asyncHandler(async (req, res) => {
  const record = await PurchaseBarcode.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Barcode record not found');
  }
  res.json({ success: true, record });
});

const createBarcodeRecord = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    company: scopeCompany(req),
    createdBy: req.user._id,
    supplierId: req.body.supplierId || req.body.supplier || null,
    pricing: {
      ...req.body.pricing,
      finalPrice: Number(req.body.pricing?.finalPrice || 0),
      rspPrice: Number(req.body.pricing?.rspPrice || 0),
      wspPrice: Number(req.body.pricing?.wspPrice || 0),
      dpPrice: Number(req.body.pricing?.dpPrice || 0),
      purchaseRate: Number(req.body.pricing?.purchaseRate || 0),
      discount: Number(req.body.pricing?.discount || 0),
      quantity: Number(req.body.pricing?.quantity || 0),
      markupRSP: Number(req.body.pricing?.markupRSP || 0),
      markupWSP: Number(req.body.pricing?.markupWSP || 0),
      markupDP: Number(req.body.pricing?.markupDP || 0),
    },
    isInventoryItem: req.body.isInventoryItem !== false,
  };

  const record = await PurchaseBarcode.create(payload);
  res.status(201).json({ success: true, record });
});

const updateBarcodeRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseBarcode.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Barcode record not found');
  }

  Object.assign(record, {
    ...req.body,
    supplierId: req.body.supplierId || req.body.supplier || record.supplierId,
    pricing: {
      ...(record.pricing || {}),
      ...(req.body.pricing || {}),
      finalPrice: Number((req.body.pricing && req.body.pricing.finalPrice) || record.pricing?.finalPrice || 0),
      rspPrice: Number((req.body.pricing && req.body.pricing.rspPrice) || record.pricing?.rspPrice || 0),
      wspPrice: Number((req.body.pricing && req.body.pricing.wspPrice) || record.pricing?.wspPrice || 0),
      dpPrice: Number((req.body.pricing && req.body.pricing.dpPrice) || record.pricing?.dpPrice || 0),
      purchaseRate: Number((req.body.pricing && req.body.pricing.purchaseRate) || record.pricing?.purchaseRate || 0),
      discount: Number((req.body.pricing && req.body.pricing.discount) || record.pricing?.discount || 0),
      quantity: Number((req.body.pricing && req.body.pricing.quantity) || record.pricing?.quantity || 0),
      markupRSP: Number((req.body.pricing && req.body.pricing.markupRSP) || record.pricing?.markupRSP || 0),
      markupWSP: Number((req.body.pricing && req.body.pricing.markupWSP) || record.pricing?.markupWSP || 0),
      markupDP: Number((req.body.pricing && req.body.pricing.markupDP) || record.pricing?.markupDP || 0),
    },
    isInventoryItem: req.body.isInventoryItem !== undefined ? req.body.isInventoryItem : record.isInventoryItem,
  });
  await record.save();
  res.json({ success: true, record });
});

const deleteBarcodeRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseBarcode.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Barcode record not found');
  }
  res.json({ success: true, message: 'Barcode record deleted' });
});

const getPurchaseReturns = asyncHandler(async (req, res) => {
  const { baseQuery, skip, safeLimit } = listQuery(PurchaseReturn, req);
  const [items, total] = await Promise.all([
    PurchaseReturn.find(baseQuery).sort({ createdAt: -1 }).skip(skip).limit(safeLimit),
    PurchaseReturn.countDocuments(baseQuery),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(req.query.page || 1), limit: safeLimit, pages: Math.ceil(total / safeLimit) || 1 } });
});

const getPurchaseReturnById = asyncHandler(async (req, res) => {
  const record = await PurchaseReturn.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Return record not found');
  }
  res.json({ success: true, record });
});

const createPurchaseReturnRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseReturn.create({
    ...req.body,
    company: scopeCompany(req),
    createdBy: req.user._id,
    totalAmount: Number(req.body.totalAmount || 0),
    items: req.body.items || [],
  });
  res.status(201).json({ success: true, record });
});

const updatePurchaseReturnRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseReturn.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Return record not found');
  }

  Object.assign(record, { ...req.body, totalAmount: Number(req.body.totalAmount || record.totalAmount), items: req.body.items || record.items });
  await record.save();
  res.json({ success: true, record });
});

const deletePurchaseReturnRecord = asyncHandler(async (req, res) => {
  const record = await PurchaseReturn.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!record) {
    res.status(404);
    throw new Error('Return record not found');
  }
  res.json({ success: true, message: 'Return record deleted' });
});

module.exports = {
  getDeliveryRecords,
  getDeliveryRecordById,
  createDeliveryRecord,
  updateDeliveryRecord,
  deleteDeliveryRecord,
  getGoodsPurchaseRecords,
  getGoodsPurchaseRecordById,
  createGoodsPurchaseRecord,
  updateGoodsPurchaseRecord,
  deleteGoodsPurchaseRecord,
  getBarcodeRecords,
  getBarcodeRecordById,
  createBarcodeRecord,
  updateBarcodeRecord,
  deleteBarcodeRecord,
  getPurchaseReturns,
  getPurchaseReturnById,
  createPurchaseReturnRecord,
  updatePurchaseReturnRecord,
  deletePurchaseReturnRecord,
};
