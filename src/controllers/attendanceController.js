const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Attendance = require('../models/Attendance');
const AttendanceOverride = require('../models/AttendanceOverride');
const Employee = require('../models/Employee');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const normalizeDate = (dateInput) => {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  return date;
};

const createAttendance = asyncHandler(async (req, res) => {
  const { employee, date, status, checkIn, checkOut, notes } = req.body;
  if (!employee || !date || !status) {
    res.status(400);
    throw new Error('employee, date and status are required');
  }

  const companyId = scopeCompany(req);
  const employeeRecord = await Employee.findOne({ _id: employee, company: companyId });
  if (!employeeRecord) {
    res.status(404);
    throw new Error('Employee not found');
  }

  const attendanceDate = normalizeDate(date);
  const existing = await Attendance.findOne({ company: companyId, employee, date: attendanceDate, isActive: true });
  if (existing) {
    res.status(400);
    throw new Error('Attendance already exists for this employee and date');
  }

  const attendance = await Attendance.create({
    company: companyId,
    employee,
    employeeCode: employeeRecord.employeeCode,
    employeeName: employeeRecord.name,
    department: employeeRecord.department,
    date: attendanceDate,
    month: attendanceDate.getMonth() + 1,
    year: attendanceDate.getFullYear(),
    status,
    checkIn,
    checkOut,
    notes,
    createdBy: req.user._id,
  });

  await logAudit({
    company: companyId,
    user: req.user,
    module: 'attendance',
    action: 'create',
    recordId: attendance._id,
    summary: `Marked attendance for ${employeeRecord.name} on ${attendanceDate.toISOString().slice(0, 10)}`,
  });

  res.status(201).json({ success: true, attendance });
});

const listAttendance = asyncHandler(async (req, res) => {
  const { employee, from, to, status, page = 1, limit = 31 } = req.query;
  const query = { company: scopeCompany(req), isActive: true };
  if (employee) query.employee = employee;
  if (status) query.status = status;
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = normalizeDate(from);
    if (to) query.date.$lte = normalizeDate(to);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Attendance.find(query)
      .populate('employee', 'name employeeCode department')
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Attendance.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

const getAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({ _id: req.params.id, company: scopeCompany(req), isActive: true }).populate('employee', 'name employeeCode department');
  if (!attendance) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  res.json({ success: true, attendance });
});

const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({ _id: req.params.id, company: scopeCompany(req), isActive: true });
  if (!attendance) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  const fields = ['status', 'checkIn', 'checkOut', 'notes'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) attendance[field] = req.body[field];
  });
  attendance.updatedBy = req.user._id;
  await attendance.save();

  await logAudit({
    company: scopeCompany(req),
    user: req.user,
    module: 'attendance',
    action: 'update',
    recordId: attendance._id,
    summary: `Updated attendance for record ${attendance._id}`,
  });

  res.json({ success: true, attendance });
});

const removeAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!attendance) {
    res.status(404);
    throw new Error('Attendance record not found');
  }

  attendance.isActive = false;
  attendance.updatedBy = req.user._id;
  await attendance.save();

  await logAudit({
    company: scopeCompany(req),
    user: req.user,
    module: 'attendance',
    action: 'delete',
    recordId: attendance._id,
    summary: `Soft deleted attendance record ${attendance._id}`,
  });

  res.json({ success: true, message: 'Attendance removed' });
});

const employeeSummary = asyncHandler(async (req, res) => {
  const { employeeId, month, year } = req.query;
  if (!employeeId || !month || !year) {
    res.status(400);
    throw new Error('employeeId, month and year are required');
  }

  const companyId = scopeCompany(req);
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

  const summary = await Attendance.aggregate([
    { $match: { company: companyId, employee: mongoose.Types.ObjectId(employeeId), date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { present: 0, absent: 0, halfDay: 0, leave: 0, holiday: 0, checkedIn: 0, checkedOut: 0 };
  summary.forEach((item) => {
    if (item._id === 'present') result.present = item.count;
    if (item._id === 'absent') result.absent = item.count;
    if (item._id === 'half_day') result.halfDay = item.count;
    if (item._id === 'leave') result.leave = item.count;
    if (item._id === 'holiday') result.holiday = item.count;
  });

  const overrides = await AttendanceOverride.find({ company: companyId, month: Number(month), year: Number(year) });
  overrides.forEach((override) => {
    result[override.field] = override.value;
  });

  res.json({ success: true, summary: result });
});

const monthSummary = asyncHandler(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    res.status(400);
    throw new Error('month and year are required');
  }

  const companyId = scopeCompany(req);
  const start = new Date(Number(year), Number(month) - 1, 1);
  const end = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

  const summary = await Attendance.aggregate([
    { $match: { company: companyId, date: { $gte: start, $lte: end } } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { present: 0, absent: 0, halfDay: 0, leave: 0, holiday: 0, checkedIn: 0, checkedOut: 0 };
  summary.forEach((item) => {
    if (item._id === 'present') result.present = item.count;
    if (item._id === 'absent') result.absent = item.count;
    if (item._id === 'half_day') result.halfDay = item.count;
    if (item._id === 'leave') result.leave = item.count;
    if (item._id === 'holiday') result.holiday = item.count;
  });

  const overrides = await AttendanceOverride.find({ company: companyId, month: Number(month), year: Number(year) });
  overrides.forEach((override) => {
    result[override.field] = override.value;
  });

  res.json({ success: true, summary: result });
});

const upsertOverride = asyncHandler(async (req, res) => {
  const { month, year, field, value } = req.body;
  if (!month || !year || !field || value === undefined) {
    res.status(400);
    throw new Error('month, year, field and value are required');
  }

  const companyId = scopeCompany(req);
  const override = await AttendanceOverride.findOneAndUpdate(
    { company: companyId, month: Number(month), year: Number(year), field },
    { value: Number(value), setBy: req.user._id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await logAudit({
    company: companyId,
    user: req.user,
    module: 'attendance',
    action: 'update',
    recordId: override._id,
    summary: `Overrode ${field} for ${month}/${year} to ${value}`,
  });

  res.json({ success: true, override });
});

module.exports = {
  createAttendance,
  listAttendance,
  getAttendance,
  updateAttendance,
  removeAttendance,
  employeeSummary,
  monthSummary,
  upsertOverride,
};
