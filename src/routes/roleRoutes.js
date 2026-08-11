const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Role = require('../models/Role');
const { protect } = require('../middleware/auth');

router.use(protect);

// @desc    Get all roles
// @route   GET /api/roles
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, q, isActive } = req.query;
  const company = req.user.company;

  const query = { company };
  
  if (q) {
    query.$or = [
      { roleName: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (isActive !== undefined) query.isActive = isActive === 'true';

  const total = await Role.countDocuments(query);
  const roles = await Role.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();

  res.json({
    success: true,
    data: roles,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
}));

// @desc    Get single role
// @route   GET /api/roles/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id)
    .populate('company', 'name code');

  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }

  res.json({ success: true, data: role });
}));

// @desc    Create new role
// @route   POST /api/roles
router.post('/', asyncHandler(async (req, res) => {
  const company = req.user.company;
  
  // Check if role name already exists for this company
  const existingRole = await Role.findOne({ 
    company, 
    roleName: req.body.roleName 
  });

  if (existingRole) {
    res.status(400);
    throw new Error('Role with this name already exists');
  }

  const role = await Role.create({
    ...req.body,
    company,
    createdBy: req.user._id
  });

  res.status(201).json({ success: true, data: role });
}));

// @desc    Update role
// @route   PUT /api/roles/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }

  // Prevent updating system roles
  if (role.isSystemRole) {
    res.status(403);
    throw new Error('System roles cannot be modified');
  }

  // Security: ensure role belongs to user's company
  if (role.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this role');
  }

  Object.assign(role, req.body, { updatedBy: req.user._id });
  await role.save();

  res.json({ success: true, data: role });
}));

// @desc    Delete role
// @route   DELETE /api/roles/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);

  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }

  // Prevent deleting system roles
  if (role.isSystemRole) {
    res.status(403);
    throw new Error('System roles cannot be deleted');
  }

  // Security check
  if (role.company.toString() !== req.user.company.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this role');
  }

  // Check if any staff are using this role
  const Staff = require('../models/Staff');
  const staffCount = await Staff.countDocuments({ role: role._id });
  
  if (staffCount > 0) {
    res.status(400);
    throw new Error(`Cannot delete role. ${staffCount} staff member(s) are assigned to this role`);
  }

  await role.deleteOne();

  res.json({ success: true, message: 'Role deleted' });
}));

module.exports = router;
