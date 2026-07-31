const asyncHandler = require('express-async-handler');
const LeaveRequest = require('../models/LeaveRequest');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createLeaveRequest = asyncHandler(async (req, res) => {
  const { employee, leaveType, fromDate, toDate, reason } = req.body;
  if (!employee || !leaveType || !fromDate || !toDate) {
    res.status(400);
    throw new Error('employee, leaveType, fromDate and toDate are required');
  }
  const leave = await LeaveRequest.create({
    company: scopeCompany(req), employee, leaveType, fromDate, toDate, reason, createdBy: req.user._id,
  });
  res.status(201).json({ success: true, leave });
});

const getLeaveRequests = asyncHandler(async (req, res) => {
  const { employee, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (employee) query.employee = employee;
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    LeaveRequest.find(query).populate('employee', 'name employeeCode').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    LeaveRequest.countDocuments(query),
  ]);

  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const decideLeaveRequest = asyncHandler(async (req, res) => {
  const { status } = req.body; // approved | rejected
  if (!['approved', 'rejected'].includes(status)) {
    res.status(400);
    throw new Error('status must be approved or rejected');
  }
  const leave = await LeaveRequest.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!leave) {
    res.status(404);
    throw new Error('Leave request not found');
  }
  leave.status = status;
  leave.approvedBy = req.user._id;
  await leave.save();
  res.json({ success: true, leave });
});

module.exports = { createLeaveRequest, getLeaveRequests, decideLeaveRequest };
