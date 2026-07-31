const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

// @desc  Manual stock adjustment (in/out/adjustment) with ledger entry
// @route POST /api/inventory/adjust
const adjustStock = asyncHandler(async (req, res) => {
  const { productId, type, quantity, reason } = req.body;

  if (!productId || !type || quantity === undefined) {
    res.status(400);
    throw new Error('productId, type and quantity are required');
  }
  if (!['in', 'out', 'adjustment'].includes(type)) {
    res.status(400);
    throw new Error('type must be one of: in, out, adjustment');
  }

  const session = await mongoose.startSession();
  let ledgerEntry;
  let updatedProduct;

  try {
    await session.withTransaction(async () => {
      const product = await Product.findOne({ _id: productId, company: scopeCompany(req) }).session(session);
      if (!product) {
        throw new Error('Product not found');
      }

      const delta = type === 'out' ? -Math.abs(quantity) : Math.abs(quantity);
      const newBalance = type === 'adjustment' ? Number(quantity) : product.stockQty + delta;

      if (newBalance < 0) {
        throw new Error('Insufficient stock for this operation');
      }

      product.stockQty = newBalance;
      await product.save({ session });

      const [entry] = await StockLedger.create(
        [
          {
            company: scopeCompany(req),
            product: product._id,
            type,
            quantity: type === 'adjustment' ? newBalance - (product.stockQty - delta) : delta,
            balanceAfter: newBalance,
            reason,
            createdBy: req.user._id,
          },
        ],
        { session }
      );

      ledgerEntry = entry;
      updatedProduct = product;
    });
  } finally {
    session.endSession();
  }

  res.status(201).json({ success: true, ledgerEntry, product: updatedProduct });
});

// @desc  Get full stock ledger (with filters) - "Stock Register" report
// @route GET /api/inventory/ledger
const getStockLedger = asyncHandler(async (req, res) => {
  const { productId, type, page = 1, limit = 30 } = req.query;
  const query = { company: scopeCompany(req) };
  if (productId) query.product = productId;
  if (type) query.type = type;

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    StockLedger.find(query).populate('product', 'name sku').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    StockLedger.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Low stock / reorder report
// @route GET /api/inventory/low-stock
const getLowStock = asyncHandler(async (req, res) => {
  const products = await Product.find({
    company: scopeCompany(req),
    isDeleted: { $ne: true },
    $expr: { $lte: ['$stockQty', '$reorderLevel'] },
  }).sort({ stockQty: 1 });

  res.json({ success: true, data: products });
});

module.exports = { adjustStock, getStockLedger, getLowStock };
