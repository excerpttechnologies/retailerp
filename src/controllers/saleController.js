const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');
const Customer = require('../models/Customer');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const generateInvoiceNumber = async (companyId) => {
  const count = await Sale.countDocuments({ company: companyId });
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
};

// @desc  Create a sale / POS transaction. Atomically decrements stock and writes ledger.
// @route POST /api/sales
const createSale = asyncHandler(async (req, res) => {
  const { customer, items, paymentMethod, paymentStatus, channel, notes } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('At least one item is required');
  }

  const companyId = scopeCompany(req);
  const session = await mongoose.startSession();
  let sale;

  try {
    await session.withTransaction(async () => {
      let subtotal = 0;
      let taxTotal = 0;
      let discountTotal = 0;
      const resolvedItems = [];

      for (const item of items) {
        const product = await Product.findOne({ _id: item.product, company: companyId }).session(session);
        if (!product) throw new Error(`Product not found: ${item.product}`);
        if (product.stockQty < item.qty) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stockQty}`);
        }

        const price = item.price ?? product.pricing.sellingPrice;
        const discount = Number(item.discount || 0);
        const taxRate = item.taxRate ?? product.taxRate ?? 0;
        const lineSubtotal = price * item.qty - discount;
        const lineTax = (lineSubtotal * taxRate) / 100;
        const lineTotal = lineSubtotal + lineTax;

        subtotal += lineSubtotal;
        taxTotal += lineTax;
        discountTotal += discount;

        resolvedItems.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          qty: item.qty,
          price,
          taxRate,
          discount,
          total: lineTotal,
        });

        product.stockQty -= item.qty;
        await product.save({ session });

        await StockLedger.create(
          [
            {
              company: companyId,
              product: product._id,
              type: 'out',
              quantity: -item.qty,
              balanceAfter: product.stockQty,
              reference: 'sale',
              reason: 'Sale transaction',
              createdBy: req.user._id,
            },
          ],
          { session }
        );
      }

      const invoiceNumber = await generateInvoiceNumber(companyId);
      const grandTotal = subtotal + taxTotal;

      const [createdSale] = await Sale.create(
        [
          {
            company: companyId,
            invoiceNumber,
            customer: customer || null,
            items: resolvedItems,
            subtotal,
            taxTotal,
            discountTotal,
            grandTotal,
            paymentMethod: paymentMethod || 'cash',
            paymentStatus: paymentStatus || 'paid',
            channel: channel || 'pos',
            notes,
            cashier: req.user._id,
          },
        ],
        { session }
      );

      if (customer) {
        await Customer.updateOne(
          { _id: customer },
          { $inc: { loyaltyPoints: Math.floor(grandTotal / 100) } },
          { session }
        );
      }

      sale = createdSale;
    });
  } finally {
    session.endSession();
  }

  res.status(201).json({ success: true, sale });
});

// @desc  List sales with filters
// @route GET /api/sales
const getSales = asyncHandler(async (req, res) => {
  const { search, status, channel, from, to, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;
  if (channel) query.channel = channel;
  if (search) query.invoiceNumber = { $regex: search, $options: 'i' };
  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Sale.find(query).populate('customer', 'name phone').populate('cashier', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Sale.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single sale / invoice
// @route GET /api/sales/:id
const getSaleById = asyncHandler(async (req, res) => {
  const sale = await Sale.findOne({ _id: req.params.id, company: scopeCompany(req) })
    .populate('customer')
    .populate('cashier', 'name email');
  if (!sale) {
    res.status(404);
    throw new Error('Sale not found');
  }
  res.json({ success: true, sale });
});

// @desc  Cancel / return a sale - restocks items
// @route PATCH /api/sales/:id/cancel
const cancelSale = asyncHandler(async (req, res) => {
  const companyId = scopeCompany(req);
  const session = await mongoose.startSession();
  let sale;

  try {
    await session.withTransaction(async () => {
      sale = await Sale.findOne({ _id: req.params.id, company: companyId }).session(session);
      if (!sale) throw new Error('Sale not found');
      if (sale.status === 'cancelled') throw new Error('Sale already cancelled');

      for (const item of sale.items) {
        const product = await Product.findById(item.product).session(session);
        if (product) {
          product.stockQty += item.qty;
          await product.save({ session });
          await StockLedger.create(
            [
              {
                company: companyId,
                product: product._id,
                type: 'in',
                quantity: item.qty,
                balanceAfter: product.stockQty,
                reference: 'sale-cancel',
                reason: `Restock from cancelled sale ${sale.invoiceNumber}`,
                createdBy: req.user._id,
              },
            ],
            { session }
          );
        }
      }

      sale.status = 'cancelled';
      await sale.save({ session });
    });
  } finally {
    session.endSession();
  }

  res.json({ success: true, message: 'Sale cancelled and stock restored', sale });
});

module.exports = { createSale, getSales, getSaleById, cancelSale };
