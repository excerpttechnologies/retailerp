const asyncHandler = require('express-async-handler');
const AuditLog = require('../models/AuditLog');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

// @desc  List audit log entries (activity log / compliance report)
// @route GET /api/audit-logs
const getAuditLogs = asyncHandler(async (req, res) => {
  const { module, action, page = 1, limit = 30 } = req.query;
  const query = { company: scopeCompany(req) };
  if (module) query.module = module;
  if (action) query.action = action;

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    AuditLog.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

module.exports = { getAuditLogs };
