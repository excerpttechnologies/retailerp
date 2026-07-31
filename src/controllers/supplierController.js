const asyncHandler = require('express-async-handler');
const Supplier = require('../models/Supplier');
const { logAudit } = require('../utils/audit');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createSupplier = asyncHandler(async (req, res) => {
  const { name, contactPerson, email, phone, gstNumber, address, paymentTerms, rating, notes } = req.body;
  if (!name || !phone) {
    res.status(400);
    throw new Error('name and phone are required');
  }

  const documents = (req.files || []).map((f) => `/uploads/documents/${f.filename}`);

  const supplier = await Supplier.create({
    company: scopeCompany(req), name, contactPerson, email, phone, gstNumber, address,
    paymentTerms, rating, notes, documents, createdBy: req.user._id,
  });

  await logAudit({ company: scopeCompany(req), user: req.user, module: 'suppliers', action: 'create', recordId: supplier._id, summary: `Created supplier ${name}` });
  res.status(201).json({ success: true, supplier });
});

const getSuppliers = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req), isDeleted: { $ne: true } };
  if (status) query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Supplier.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Supplier.countDocuments(query),
  ]);

  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const getSupplierById = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  res.json({ success: true, supplier });
});

const updateSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  const fields = ['name', 'contactPerson', 'email', 'phone', 'gstNumber', 'address', 'paymentTerms', 'rating', 'notes', 'status'];
  fields.forEach((f) => { if (req.body[f] !== undefined) supplier[f] = req.body[f]; });
  if (req.files && req.files.length > 0) supplier.documents.push(...req.files.map((f) => `/uploads/documents/${f.filename}`));

  await supplier.save();
  await logAudit({ company: scopeCompany(req), user: req.user, module: 'suppliers', action: 'update', recordId: supplier._id, summary: `Updated supplier ${supplier.name}` });
  res.json({ success: true, supplier });
});

const deleteSupplier = asyncHandler(async (req, res) => {
  const supplier = await Supplier.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!supplier) {
    res.status(404);
    throw new Error('Supplier not found');
  }
  supplier.isDeleted = true;
  supplier.status = 'inactive';
  await supplier.save();
  await logAudit({ company: scopeCompany(req), user: req.user, module: 'suppliers', action: 'delete', recordId: supplier._id, summary: `Deleted supplier ${supplier.name}` });
  res.json({ success: true, message: 'Supplier deleted' });
});

module.exports = { createSupplier, getSuppliers, getSupplierById, updateSupplier, deleteSupplier };
