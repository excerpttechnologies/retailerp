const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Staff = require('../models/Staff');
const { protect } = require('../middleware/auth');

router.use(protect);

// @desc    Get all staff
// @route   GET /api/staff
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, q, isActive, department, role } = req.query;
  const company = req.user.company;

  const query = { company };
  
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { staffCode: { $regex: q, $options: 'i' } },
      { mobile: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (isActive !== undefined) query.isActive = isActive === 'true';
  if (department) query.department = department;
  if (role) query.role = role;

  const total = await Staff.countDocuments(query);
  const staff = await Staff.find(query)
    .populate('role', 'roleName')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  res.json({
    success: true,
    data: staff,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get single staff
// @route   GET /api/staff/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id)
    .populate('role')
    .populate('userId', 'name email status')
    .populate('company', 'name code');

  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  res.json({ success: true, data: staff });
}));

// @desc    Create new staff
// @route   POST /api/staff
router.post('/', asyncHandler(async (req, res) => {
  const company = req.user.company;
  
  const staff = await Staff.create({
    ...req.body,
    company,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: staff });
}));

// @desc    Update staff
// @route   PUT /api/staff/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  // Security: ensure staff belongs to user's company
  if (staff.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this staff');
  }

  Object.assign(staff, req.body, { updatedBy: req.user._id });
  await staff.save();

  res.json({ success: true, data: staff });
}));

// @desc    Delete staff
// @route   DELETE /api/staff/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const staff = await Staff.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff not found');
  }

  // Security check
  if (staff.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this staff');
  }

  await staff.deleteOne();

  res.json({ success: true, message: 'Staff deleted' });
}));

module.exports = router;
