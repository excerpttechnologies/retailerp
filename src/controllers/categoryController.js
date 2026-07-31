const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

const slugify = (str) =>
  str.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const scopeCompany = (req) => req.user.company?._id || req.user.company;

// @desc  Create category
// @route POST /api/categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, parent, description, status } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const category = await Category.create({
    company: scopeCompany(req),
    name,
    slug: slugify(name),
    parent: parent || null,
    description,
    status: status || 'active',
    image: req.file ? `/uploads/products/${req.file.filename}` : null,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, category });
});

// @desc  List categories (with optional parent tree, search, pagination)
// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 50 } = req.query;
  const query = { company: scopeCompany(req), isDeleted: { $ne: true } };
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [data, total] = await Promise.all([
    Category.find(query).populate('parent', 'name').sort({ name: 1 }).skip(skip).limit(Number(limit)),
    Category.countDocuments(query),
  ]);

  res.json({
    success: true,
    data,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single category
// @route GET /api/categories/:id
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, company: scopeCompany(req) }).populate('parent', 'name');
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, category });
});

// @desc  Update category
// @route PUT /api/categories/:id
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const { name, parent, description, status } = req.body;
  if (name) {
    category.name = name;
    category.slug = slugify(name);
  }
  if (parent !== undefined) category.parent = parent || null;
  if (description !== undefined) category.description = description;
  if (status !== undefined) category.status = status;
  if (req.file) category.image = `/uploads/products/${req.file.filename}`;

  await category.save();
  res.json({ success: true, category });
});

// @desc  Soft delete category
// @route DELETE /api/categories/:id
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id, company: scopeCompany(req) });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  category.isDeleted = true;
  category.status = 'inactive';
  await category.save();
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };
