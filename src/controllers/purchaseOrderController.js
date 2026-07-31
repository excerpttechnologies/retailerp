const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const PurchaseOrder = require('../models/PurchaseOrder');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const generatePoNumber = async (companyId) => {
  const count = await PurchaseOrder.countDocuments({ company: companyId });
  return `PO-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
};

// @desc  Create a purchase order (draft)
// @route POST /api/purchase-orders
const createPurchaseOrder = asyncHandler(async (req, res) => {
  const { supplier, items, expectedDate, notes } = req.body;
  if (!supplier || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('supplier and at least one item are required');
  }

  const companyId = scopeCompany(req);
  const resolvedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findOne({ _id: item.product, company: companyId });
    if (!product) {
      res.status(400);
      throw new Error(`Product not found: ${item.product}`);
    }
    const total = item.costPrice * item.qty;
    subtotal += total;
    resolvedItems.push({
      product: product._id, name: product.name, sku: product.sku,
      qty: item.qty, costPrice: item.costPrice, total, receivedQty: 0,
    });
  }

  const poNumber = await generatePoNumber(companyId);
  const po = await PurchaseOrder.create({
    company: companyId, poNumber, supplier, items: resolvedItems, subtotal, expectedDate, notes, createdBy: req.user._id,
  });

  await logAudit({ company: companyId, user: req.user, module: 'purchaseOrders', action: 'create', recordId: po._id, summary: `Created PO ${poNumber}` });
  res.status(201).json({ success: true, purchaseOrder: po });
});

// @desc  List purchase orders
// @route GET /api/purchase-orders
const getPurchaseOrders = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;
  if (search) query.poNumber = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    PurchaseOrder.find(query).populate('supplier', 'name phone').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    PurchaseOrder.countDocuments(query),
  ]);

  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

// @desc  Get single purchase order
// @route GET /api/purchase-orders/:id
const getPurchaseOrderById = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findOne({ _id: req.params.id, company: scopeCompany(req) }).populate('supplier');
  if (!po) {
    res.status(404);
    throw new Error('Purchase order not found');
  }
  res.json({ success: true, purchaseOrder: po });
});

// @desc  Mark a PO as sent to supplier
// @route PATCH /api/purchase-orders/:id/send
const sendPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!po) {
    res.status(404);
    throw new Error('Purchase order not found');
  }
  if (po.status !== 'draft') {
    res.status(400);
    throw new Error('Only draft purchase orders can be sent');
  }
  po.status = 'sent';
  await po.save();
  res.json({ success: true, purchaseOrder: po });
});

// @desc  Receive goods against a PO (fully or partially) — atomically increases
//        stock and writes a stock-ledger entry per product received.
// @route POST /api/purchase-orders/:id/receive
const receivePurchaseOrder = asyncHandler(async (req, res) => {
  const { receipts } = req.body; // [{ product, qty }]
  if (!receipts || !Array.isArray(receipts) || receipts.length === 0) {
    res.status(400);
    throw new Error('receipts array is required, e.g. [{ product, qty }]');
  }

  const companyId = scopeCompany(req);
  const session = await mongoose.startSession();
  let po;

  try {
    await session.withTransaction(async () => {
      po = await PurchaseOrder.findOne({ _id: req.params.id, company: companyId }).session(session);
      if (!po) throw new Error('Purchase order not found');
      if (['received', 'cancelled'].includes(po.status)) throw new Error(`Cannot receive a ${po.status} purchase order`);

      for (const receipt of receipts) {
        const line = po.items.find((it) => String(it.product) === String(receipt.product));
        if (!line) throw new Error(`Product ${receipt.product} is not on this PO`);

        const remaining = line.qty - line.receivedQty;
        const qtyToReceive = Math.min(Number(receipt.qty), remaining);
        if (qtyToReceive <= 0) continue;

        line.receivedQty += qtyToReceive;

        const product = await Product.findById(line.product).session(session);
        if (product) {
          product.stockQty += qtyToReceive;
          await product.save({ session });

          await StockLedger.create(
            [{
              company: companyId, product: product._id, type: 'in', quantity: qtyToReceive,
              balanceAfter: product.stockQty, reference: 'purchase_order',
              reason: `Received against PO ${po.poNumber}`, createdBy: req.user._id,
            }],
            { session }
          );
        }
      }

      const allReceived = po.items.every((it) => it.receivedQty >= it.qty);
      const anyReceived = po.items.some((it) => it.receivedQty > 0);
      po.status = allReceived ? 'received' : anyReceived ? 'partially_received' : po.status;

      await po.save({ session });
    });
  } finally {
    session.endSession();
  }

  await logAudit({ company: companyId, user: req.user, module: 'purchaseOrders', action: 'update', recordId: po._id, summary: `Received stock against PO ${po.poNumber}` });
  res.json({ success: true, purchaseOrder: po });
});

// @desc  Cancel a purchase order
// @route PATCH /api/purchase-orders/:id/cancel
const cancelPurchaseOrder = asyncHandler(async (req, res) => {
  const po = await PurchaseOrder.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!po) {
    res.status(404);
    throw new Error('Purchase order not found');
  }
  if (['received', 'cancelled'].includes(po.status)) {
    res.status(400);
    throw new Error(`Cannot cancel a ${po.status} purchase order`);
  }
  po.status = 'cancelled';
  await po.save();
  res.json({ success: true, purchaseOrder: po });
});

module.exports = {
  createPurchaseOrder, getPurchaseOrders, getPurchaseOrderById,
  sendPurchaseOrder, receivePurchaseOrder, cancelPurchaseOrder,
};
