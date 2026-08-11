const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const StockLedger = require('../models/StockLedger');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const genSku = (name) => {
  const prefix = name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() || 'PRD';
  const suffix = Date.now().toString().slice(-6);
  return `${prefix}-${suffix}`;
};

// @desc  Create product (with opening stock ledger entry)
// @route POST /api/products
const createProduct = asyncHandler(async (req, res) => {
  const {
    name, sku, barcode, category, brand, unit, description, taxRate, reorderLevel,
    tags, status, openingStock,
    mrp, sellingPrice, wholesalePrice, dealerPrice, costPrice,
  } = req.body;

  if (!name || !sellingPrice) {
    res.status(400);
    throw new Error('name and sellingPrice are required');
  }

  const images = (req.files || []).map((f) => `/uploads/products/${f.filename}`);

  const product = await Product.create({
    company: scopeCompany(req),
    name,
    sku: sku ? sku.toUpperCase() : genSku(name),
    barcode,
    category: category || undefined,
    brand,
    unit,
    description,
    images,
    pricing: { mrp, sellingPrice, wholesalePrice, dealerPrice, costPrice },
    taxRate,
    reorderLevel,
    tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map((t) => t.trim())) : [],
    status: status || 'active',
    stockQty: Number(openingStock) || 0,
    createdBy: req.user._id,
  });

  if (Number(openingStock) > 0) {
    await StockLedger.create({
      company: scopeCompany(req),
      product: product._id,
      type: 'opening',
      quantity: Number(openingStock),
      balanceAfter: Number(openingStock),
      reason: 'Opening stock at product creation',
      createdBy: req.user._id,
    });
  }

  res.status(201).json({ success: true, product });
});

// @desc  List products with search / filter / pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, status, lowStock, page = 1, limit = 20, sortBy = '-createdAt' } = req.query;
  const query = { company: scopeCompany(req), isDeleted: { $ne: true } };

  if (category) query.category = category;
  if (status) query.status = status;
  if (search) query.$text = { $search: search };
  if (lowStock === 'true') query.$expr = { $lte: ['$stockQty', '$reorderLevel'] };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Product.find(query).populate('category', 'name').sort(sortBy).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, company: scopeCompany(req) }).populate('category', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const stockHistory = await StockLedger.find({ product: product._id }).sort({ createdAt: -1 }).limit(20);
  res.json({ success: true, product, stockHistory });
});

// @desc  Update product
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'barcode', 'category', 'brand', 'unit', 'description', 'taxRate', 'reorderLevel', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  if (req.body.sku) product.sku = req.body.sku.toUpperCase();
  if (req.body.tags) {
    product.tags = Array.isArray(req.body.tags) ? req.body.tags : String(req.body.tags).split(',').map((t) => t.trim());
  }
  ['mrp', 'sellingPrice', 'wholesalePrice', 'dealerPrice', 'costPrice'].forEach((p) => {
    if (req.body[p] !== undefined) product.pricing[p] = req.body[p];
  });
  if (req.files && req.files.length > 0) {
    product.images.push(...req.files.map((f) => `/uploads/products/${f.filename}`));
  }

  await product.save();
  res.json({ success: true, product });
});

// @desc  Soft delete product
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  product.isDeleted = true;
  product.status = 'inactive';
  await product.save();
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Bulk update product selling prices
// @route POST /api/products/bulk-update-prices
const bulkUpdatePrices = asyncHandler(async (req, res) => {
  const { updates } = req.body; // [{ product, newPrice }]
  if (!Array.isArray(updates) || updates.length === 0) {
    res.status(400);
    throw new Error('updates array is required');
  }

  const companyId = scopeCompany(req);
  const results = [];
  for (const u of updates) {
    if (!u.product) continue;
    const prod = await Product.findOne({ _id: u.product, company: companyId });
    if (!prod) {
      results.push({ product: u.product, ok: false, reason: 'not found' });
      continue;
    }
    const oldPrice = prod.pricing?.sellingPrice ?? 0;
    prod.pricing = prod.pricing || {};
    prod.pricing.sellingPrice = Number(u.newPrice) || 0;
    await prod.save();
    results.push({ product: u.product, ok: true, oldPrice, newPrice: prod.pricing.sellingPrice });
  }

  res.json({ success: true, updated: results.filter((r) => r.ok).length, results });
});

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct, bulkUpdatePrices };
