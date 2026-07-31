const asyncHandler = require('express-async-handler');
const Customer = require('../models/Customer');
const Sale = require('../models/Sale');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

// @desc  Create customer
// @route POST /api/customers
const createCustomer = asyncHandler(async (req, res) => {
  const { name, type, email, phone, alternatePhone, gstNumber, address, customerGroup, notes } = req.body;

  if (!name || !phone) {
    res.status(400);
    throw new Error('name and phone are required');
  }

  const documents = (req.files || []).map((f) => `/uploads/customers/${f.filename}`);

  const customer = await Customer.create({
    company: scopeCompany(req),
    name,
    type,
    email,
    phone,
    alternatePhone,
    gstNumber,
    address: address ? (typeof address === 'string' ? JSON.parse(address) : address) : undefined,
    customerGroup,
    notes,
    documents,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, customer });
});

// @desc  List customers
// @route GET /api/customers
const getCustomers = asyncHandler(async (req, res) => {
  const { search, status, group, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req), isDeleted: { $ne: true } };
  if (status) query.status = status;
  if (group) query.customerGroup = group;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Customer.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Customer.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single customer with purchase history & lifetime value
// @route GET /api/customers/:id
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const [purchaseHistory, ltvAgg] = await Promise.all([
    Sale.find({ customer: customer._id }).sort({ createdAt: -1 }).limit(20),
    Sale.aggregate([
      { $match: { customer: customer._id, status: 'completed' } },
      { $group: { _id: null, lifetimeValue: { $sum: '$grandTotal' }, orders: { $sum: 1 } } },
    ]),
  ]);

  res.json({
    success: true,
    customer,
    purchaseHistory,
    analytics: {
      lifetimeValue: ltvAgg[0]?.lifetimeValue || 0,
      totalOrders: ltvAgg[0]?.orders || 0,
    },
  });
});

// @desc  Update customer
// @route PUT /api/customers/:id
const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const fields = ['name', 'type', 'email', 'phone', 'alternatePhone', 'gstNumber', 'customerGroup', 'notes', 'status'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) customer[f] = req.body[f];
  });
  if (req.body.address) {
    customer.address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
  }
  if (req.files && req.files.length > 0) {
    customer.documents.push(...req.files.map((f) => `/uploads/customers/${f.filename}`));
  }

  await customer.save();
  res.json({ success: true, customer });
});

// @desc  Soft delete customer
// @route DELETE /api/customers/:id
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }
  customer.isDeleted = true;
  customer.status = 'inactive';
  await customer.save();
  res.json({ success: true, message: 'Customer deleted' });
});

module.exports = { createCustomer, getCustomers, getCustomerById, updateCustomer, deleteCustomer };
