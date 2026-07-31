const asyncHandler = require('express-async-handler');
const Employee = require('../models/Employee');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const genEmployeeCode = () => `EMP-${Date.now().toString().slice(-6)}`;

const createEmployee = asyncHandler(async (req, res) => {
  const { name, employeeCode, designation, department, email, phone, joiningDate, salary, address } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error('name and phone are required');
  }
  const documents = (req.files || []).map((f) => `/uploads/documents/${f.filename}`);

  const employee = await Employee.create({
    company: scopeCompany(req), name, employeeCode: employeeCode || genEmployeeCode(),
    designation, department, email, phone, joiningDate, salary, address, documents, createdBy: req.user._id,
  });

  await logAudit({ company: scopeCompany(req), user: req.user, module: 'employees', action: 'create', recordId: employee._id, summary: `Onboarded employee ${name}` });
  res.status(201).json({ success: true, employee });
});

const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req), isDeleted: { $ne: true } };
  if (department) query.department = department;
  if (status) query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Employee.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Employee.countDocuments(query),
  ]);

  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  res.json({ success: true, employee });
});

const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  const fields = ['name', 'designation', 'department', 'email', 'phone', 'joiningDate', 'salary', 'address', 'status'];
  fields.forEach((f) => { if (req.body[f] !== undefined) employee[f] = req.body[f]; });
  if (req.files && req.files.length > 0) employee.documents.push(...req.files.map((f) => `/uploads/documents/${f.filename}`));
  await employee.save();
  res.json({ success: true, employee });
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const employee = await Employee.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!employee) {
    res.status(404);
    throw new Error('Employee not found');
  }
  employee.isDeleted = true;
  employee.status = 'exited';
  await employee.save();
  res.json({ success: true, message: 'Employee marked as exited' });
});

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };
