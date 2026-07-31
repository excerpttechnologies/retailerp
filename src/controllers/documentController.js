const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const createDocument = asyncHandler(async (req, res) => {
  const { title, category, linkedEntityType, linkedEntityId, tags, notes } = req.body;
  if (!title || !req.file) {
    res.status(400);
    throw new Error('title and a file are required');
  }
  const doc = await Document.create({
    company: scopeCompany(req), title, category,
    file: `/uploads/documents/${req.file.filename}`,
    linkedEntityType, linkedEntityId: linkedEntityId || undefined,
    tags: tags ? String(tags).split(',').map((t) => t.trim()) : [],
    notes, createdBy: req.user._id,
  });
  res.status(201).json({ success: true, document: doc });
});

const getDocuments = asyncHandler(async (req, res) => {
  const { search, category, page = 1, limit = 20 } = req.query;
  const query = { company: scopeCompany(req) };
  if (category) query.category = category;
  if (search) query.title = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Document.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Document.countDocuments(query),
  ]);
  res.json({ success: true, data, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) } });
});

const deleteDocument = asyncHandler(async (req, res) => {
  const doc = await Document.findOneAndDelete({ _id: req.params.id, company: scopeCompany(req) });
  if (!doc) {
    res.status(404);
    throw new Error('Document not found');
  }
  res.json({ success: true, message: 'Document deleted' });
});

module.exports = { createDocument, getDocuments, deleteDocument };
