const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

// @desc  Create a company user/employee with an assigned role
// @route POST /api/users
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  const companyId = scopeCompany(req);

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('name, email, password and role are required');
  }

  const roleDoc = await Role.findOne({ _id: role, company: companyId });
  if (!roleDoc) {
    res.status(400);
    throw new Error('Invalid role for this company');
  }

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    phone,
    company: companyId,
    role,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: roleDoc.name },
  });
});

// @desc  List users of the current company
// @route GET /api/users
const getUsers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    User.find(query).populate('role', 'name').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Update a company user (role, status, profile)
// @route PUT /api/users/:id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const fields = ['name', 'phone', 'status', 'role'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) user[f] = req.body[f];
  });
  if (req.body.password) user.password = req.body.password;

  await user.save();
  res.json({ success: true, message: 'User updated' });
});

// @desc  Deactivate (soft delete) a company user
// @route DELETE /api/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.status = 'inactive';
  await user.save();
  res.json({ success: true, message: 'User deactivated' });
});

module.exports = { createUser, getUsers, updateUser, deleteUser };
