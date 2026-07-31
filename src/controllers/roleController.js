const asyncHandler = require('express-async-handler');
const Role = require('../models/Role');
const User = require('../models/User');

const ACTIONS = Role.ACTIONS || [
  'view', 'create', 'edit', 'delete', 'softDelete', 'restore', 'export', 'import',
  'approve', 'reject', 'print', 'download', 'reports', 'dashboard', 'analytics',
  'ai', 'settings', 'configure', 'manage',
];

const MODULES = [
  'dashboard', 'companies', 'branches', 'users', 'roles', 'customers', 'products',
  'categories', 'inventory', 'procurement', 'suppliers', 'purchaseOrders', 'sales',
  'pos', 'pricing', 'promotions', 'finance', 'hrms', 'logistics', 'warehouse',
  'service', 'loyalty', 'marketing', 'documents', 'workflow', 'reports',
  'aiCommandCenter', 'compliance', 'integrations', 'settings', 'masterData',
];

// @desc  List available modules & actions for building a permission matrix in the UI
// @route GET /api/roles/meta
const getPermissionMeta = asyncHandler(async (req, res) => {
  res.json({ success: true, modules: MODULES, actions: ACTIONS });
});

// @desc  Create a role scoped to the logged-in user's company
// @route POST /api/roles
const createRole = asyncHandler(async (req, res) => {
  const { name, description, permissions } = req.body;
  const companyId = req.user.company?._id || req.user.company;

  if (!companyId) {
    res.status(400);
    throw new Error('Only company users can create roles');
  }

  const role = await Role.create({
    company: companyId,
    name,
    description,
    permissions: permissions || [],
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, role });
});

// @desc  List roles for the current company
// @route GET /api/roles
const getRoles = asyncHandler(async (req, res) => {
  const companyId = req.user.company?._id || req.user.company;
  const roles = await Role.find({ company: companyId }).sort({ createdAt: -1 });
  res.json({ success: true, data: roles });
});

// @desc  Get single role
// @route GET /api/roles/:id
const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }
  res.json({ success: true, role });
});

// @desc  Update role permissions/details
// @route PUT /api/roles/:id
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }
  if (role.isSystem) {
    res.status(403);
    throw new Error('System roles (Company Admin) cannot be modified');
  }

  const { name, description, status, permissions } = req.body;
  if (name !== undefined) role.name = name;
  if (description !== undefined) role.description = description;
  if (status !== undefined) role.status = status;
  if (permissions !== undefined) role.permissions = permissions;

  await role.save();
  res.json({ success: true, role });
});

// @desc  Delete a role (blocked if users are assigned)
// @route DELETE /api/roles/:id
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id);
  if (!role) {
    res.status(404);
    throw new Error('Role not found');
  }
  if (role.isSystem) {
    res.status(403);
    throw new Error('System roles cannot be deleted');
  }

  const assignedCount = await User.countDocuments({ role: role._id });
  if (assignedCount > 0) {
    res.status(409);
    throw new Error(`Cannot delete: ${assignedCount} user(s) still assigned to this role`);
  }

  await role.deleteOne();
  res.json({ success: true, message: 'Role deleted' });
});

module.exports = {
  getPermissionMeta, createRole, getRoles, getRoleById, updateRole, deleteRole,
};
