const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const SalesPerson = require('../models/SalesPerson');
const { protect } = require('../middleware/auth');

router.use(protect);

// @desc    Get all sales persons
// @route   GET /api/sales-persons
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, q, isActive, territory } = req.query;
  const company = req.user.company;

  const query = { company };
  
  if (q) {
    query.$or = [
      { spName: { $regex: q, $options: 'i' } },
      { spCode: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { mobile: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (territory) query.territory = territory;

  const total = await SalesPerson.countDocuments(query);
  const salesPersons = await SalesPerson.find(query)
    .populate('staff', 'name email staffCode')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  res.json({
    success: true,
    data: salesPersons,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get single sales person
// @route   GET /api/sales-persons/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const salesPerson = await SalesPerson.findById(req.params.id)
    .populate('staff', 'name email mobile staffCode role')
    .populate('company', 'name code');

  if (!salesPerson) {
    res.status(404);
    throw new Error('Sales person not found');
  }

  res.json({ success: true, data: salesPerson });
}));

// @desc    Create new sales person
// @route   POST /api/sales-persons
router.post('/', asyncHandler(async (req, res) => {
  const company = req.user.company;
  
  // Check if SP code already exists
  if (req.body.spCode) {
    const existing = await SalesPerson.findOne({ 
      company, 
      spCode: req.body.spCode 
    });
    if (existing) {
      res.status(400);
      throw new Error('Sales person code already exists');
    }
  }

  const salesPerson = await SalesPerson.create({
    ...req.body,
    company,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: salesPerson });
}));

// @desc    Update sales person
// @route   PUT /api/sales-persons/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const salesPerson = await SalesPerson.findById(req.params.id);

  if (!salesPerson) {
    res.status(404);
    throw new Error('Sales person not found');
  }

  // Security: ensure belongs to user's company
  if (salesPerson.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this sales person');
  }

  Object.assign(salesPerson, req.body, { updatedBy: req.user._id });
  await salesPerson.save();

  res.json({ success: true, data: salesPerson });
}));

// @desc    Delete sales person
// @route   DELETE /api/sales-persons/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const salesPerson = await SalesPerson.findById(req.params.id);

  if (!salesPerson) {
    res.status(404);
    throw new Error('Sales person not found');
  }

  // Security check
  if (salesPerson.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this sales person');
  }

  await salesPerson.deleteOne();

  res.json({ success: true, message: 'Sales person deleted' });
}));

// @desc    Update sales person performance
// @route   PUT /api/sales-persons/:id/performance
router.put('/:id/performance', asyncHandler(async (req, res) => {
  const salesPerson = await SalesPerson.findById(req.params.id);

  if (!salesPerson) {
    res.status(404);
    throw new Error('Sales person not found');
  }

  salesPerson.performance = {
    ...salesPerson.performance,
    ...req.body,
    lastUpdated: new Date()
  };

  await salesPerson.save();

  res.json({ success: true, data: salesPerson });
}));

module.exports = router;
