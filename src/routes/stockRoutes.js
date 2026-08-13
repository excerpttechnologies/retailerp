const express = require('express');
const { protect, requirePermission } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/inventory', requirePermission('inventory', 'view'), async (req, res) => {
  const Product = require('../models/Product');
  const { page = 1, limit = 20, search = '' } = req.query;
  const query = { company: req.user.company?._id || req.user.company, isDeleted: { $ne: true } };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) || 1 } });
});

router.get('/items', requirePermission('inventory', 'view'), async (req, res) => {
  const InventoryItem = require('../models/InventoryItem');
  const { page = 1, limit = 20, search = '' } = req.query;
  const query = { company: req.user.company?._id || req.user.company };

  if (search) {
    query.$or = [
      { itemName: { $regex: search, $options: 'i' } },
      { barcode: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    InventoryItem.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    InventoryItem.countDocuments(query),
  ]);

  res.json({ success: true, data: items, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) || 1 } });
});

router.get('/items/:id', requirePermission('inventory', 'view'), async (req, res) => {
  const InventoryItem = require('../models/InventoryItem');
  const doc = await InventoryItem.findOne({ _id: req.params.id, company: req.user.company?._id || req.user.company });
  if (!doc) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, record: doc });
});

router.post('/items', requirePermission('inventory', 'create'), async (req, res) => {
  const InventoryItem = require('../models/InventoryItem');
  const doc = await InventoryItem.create({
    ...req.body,
    company: req.user.company?._id || req.user.company,
    createdBy: req.user._id,
  });
  res.status(201).json({ success: true, record: doc });
});

router.put('/items/:id', requirePermission('inventory', 'edit'), async (req, res) => {
  const InventoryItem = require('../models/InventoryItem');
  const doc = await InventoryItem.findOneAndUpdate({ _id: req.params.id, company: req.user.company?._id || req.user.company }, req.body, { new: true });
  if (!doc) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, record: doc });
});

router.delete('/items/:id', requirePermission('inventory', 'delete'), async (req, res) => {
  const InventoryItem = require('../models/InventoryItem');
  const doc = await InventoryItem.findOneAndDelete({ _id: req.params.id, company: req.user.company?._id || req.user.company });
  if (!doc) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, message: 'Item deleted' });
});

module.exports = router;
