const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Role = require('../models/Role');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).populate('role').populate('company');

    if (!user || user.status !== 'active') {
      res.status(401);
      throw new Error('Not authorized, user inactive or not found');
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized, token invalid or expired');
  }
});

// Only allow Anthropic-style super admins (Admin Portal)
const superAdminOnly = (req, res, next) => {
  if (!req.user || !req.user.isSuperAdmin) {
    res.status(403);
    throw new Error('Access restricted to super admin');
  }
  next();
};

// Checks whether the logged-in user's role has a given action permission on a module.
// Super admins and company-admin (isSystem role) bypass granular checks.
const requirePermission = (module, action) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.isSuperAdmin) return next();

    const role = req.user.role;
    if (!role) {
      res.status(403);
      throw new Error('No role assigned. Contact your administrator.');
    }

    if (role.isSystem) return next();

    const modulePerm = role.permissions.find((p) => p.module === module);
    if (!modulePerm || !modulePerm.actions.includes(action)) {
      res.status(403);
      throw new Error(`Access denied: missing '${action}' permission on '${module}'`);
    }
    next();
  });

const requireModulePermission = (action) =>
  asyncHandler(async (req, res, next) => {
    if (req.user.isSuperAdmin) return next();

    const role = req.user.role;
    if (!role) {
      res.status(403);
      throw new Error('No role assigned. Contact your administrator.');
    }

    if (role.isSystem) return next();

    const moduleKey = req.params.moduleKey;
    const modulePerm = role.permissions.find((p) => p.module === moduleKey);
    if (!modulePerm || !modulePerm.actions.includes(action)) {
      res.status(403);
      throw new Error(`Access denied: missing '${action}' permission on '${moduleKey}'`);
    }
    next();
  });

module.exports = { protect, superAdminOnly, requirePermission, requireModulePermission };
