const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Company = require('../models/Company');
const Role = require('../models/Role');
const User = require('../models/User');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

// @desc  Create a new company + its first admin user + admin role (Admin Portal only)
// @route POST /api/admin/companies
const createCompany = asyncHandler(async (req, res) => {
  const {
    name, code, businessType, businessCategory, ownerName, email, phone, alternatePhone,
    website, gstNumber, pan, taxNumber, registrationNumber, address, subscriptionPlan,
    planValidity, timezone, currency, language, notes,
    adminUsername, adminPassword,
  } = req.body;

  if (!name || !code || !email || !adminUsername || !adminPassword) {
    res.status(400);
    throw new Error('name, code, email, adminUsername and adminPassword are required');
  }

  const existing = await Company.findOne({ code: code.toUpperCase() });
  if (existing) {
    res.status(409);
    throw new Error('A company with this code already exists');
  }

  const session = await mongoose.startSession();
  let createdCompany;
  let createdUser;

  try {
    await session.withTransaction(async () => {
      const logoPath = req.file ? `/uploads/companies/${req.file.filename}` : null;

      const [company] = await Company.create(
        [
          {
            name, code, businessType, businessCategory, ownerName, email, phone, alternatePhone,
            website, gstNumber, pan, taxNumber, registrationNumber,
            address: address ? JSON.parse(typeof address === 'string' ? address : JSON.stringify(address)) : undefined,
            logo: logoPath,
            subscriptionPlan: subscriptionPlan || 'trial',
            planValidity,
            timezone, currency, language, notes,
            status: 'active',
            createdBy: req.user._id,
          },
        ],
        { session }
      );

      const [adminRole] = await Role.create(
        [
          {
            company: company._id,
            name: 'Company Admin',
            description: 'Full access to all modules for this company',
            isSystem: true,
            status: 'active',
            permissions: [],
            createdBy: req.user._id,
          },
        ],
        { session }
      );

      const [user] = await User.create(
        [
          {
            name: ownerName || name,
            email: adminUsername.toLowerCase(),
            password: adminPassword,
            company: company._id,
            role: adminRole._id,
            status: 'active',
            createdBy: req.user._id,
          },
        ],
        { session }
      );

      createdCompany = company;
      createdUser = user;
    });
  } finally {
    session.endSession();
  }

  res.status(201).json({
    success: true,
    message: 'Company created successfully',
    company: createdCompany,
    adminUser: { id: createdUser._id, email: createdUser.email },
  });
});

// @desc  List all companies with search/filter/pagination (Admin Portal)
// @route GET /api/admin/companies
const getCompanies = asyncHandler(async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const query = {};

  if (status) query.status = status;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [companies, total] = await Promise.all([
    Company.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Company.countDocuments(query),
  ]);

  // Attach live usage stats per company
  const enriched = await Promise.all(
    companies.map(async (c) => {
      const [usersCount, productsCount, salesCount] = await Promise.all([
        User.countDocuments({ company: c._id }),
        Product.countDocuments({ company: c._id, isDeleted: { $ne: true } }),
        Sale.countDocuments({ company: c._id }),
      ]);
      return { ...c.toObject(), usersCount, productsCount, salesCount };
    })
  );

  res.json({
    success: true,
    data: enriched,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// @desc  Get single company profile with operational summary
// @route GET /api/admin/companies/:id
const getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  const [usersCount, productsCount, salesCount, salesAgg] = await Promise.all([
    User.countDocuments({ company: company._id }),
    Product.countDocuments({ company: company._id, isDeleted: { $ne: true } }),
    Sale.countDocuments({ company: company._id }),
    Sale.aggregate([
      { $match: { company: company._id, status: 'completed' } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' } } },
    ]),
  ]);

  res.json({
    success: true,
    company,
    stats: {
      usersCount,
      productsCount,
      salesCount,
      revenue: salesAgg[0]?.revenue || 0,
    },
  });
});

// @desc  Update company details
// @route PUT /api/admin/companies/:id
const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  const updatable = [
    'name', 'businessType', 'businessCategory', 'ownerName', 'email', 'phone', 'alternatePhone',
    'website', 'gstNumber', 'pan', 'taxNumber', 'registrationNumber', 'subscriptionPlan',
    'planValidity', 'timezone', 'currency', 'language', 'notes',
  ];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) company[field] = req.body[field];
  });

  if (req.body.address) {
    company.address = typeof req.body.address === 'string' ? JSON.parse(req.body.address) : req.body.address;
  }
  if (req.file) {
    company.logo = `/uploads/companies/${req.file.filename}`;
  }

  await company.save();
  res.json({ success: true, message: 'Company updated', company });
});

// @desc  Change company status (activate/suspend/deactivate)
// @route PATCH /api/admin/companies/:id/status
const updateCompanyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'suspended', 'inactive'].includes(status)) {
    res.status(400);
    throw new Error('status must be one of: active, suspended, inactive');
  }

  const company = await Company.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  res.json({ success: true, message: `Company marked as ${status}`, company });
});

// @desc  Delete company (soft - marks inactive; hard delete removes record)
// @route DELETE /api/admin/companies/:id
const deleteCompany = asyncHandler(async (req, res) => {
  const { hard } = req.query;
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  if (hard === 'true') {
    await company.deleteOne();
    return res.json({ success: true, message: 'Company permanently deleted' });
  }

  company.status = 'inactive';
  await company.save();
  res.json({ success: true, message: 'Company deactivated (soft delete)', company });
});

// @desc  Global admin dashboard summary across all companies
// @route GET /api/admin/dashboard
const getAdminDashboard = asyncHandler(async (req, res) => {
  const [totalCompanies, activeCompanies, suspendedCompanies, totalUsers, totalProducts, totalSales, revenueAgg] =
    await Promise.all([
      Company.countDocuments(),
      Company.countDocuments({ status: 'active' }),
      Company.countDocuments({ status: 'suspended' }),
      User.countDocuments({ isSuperAdmin: { $ne: true } }),
      Product.countDocuments({ isDeleted: { $ne: true } }),
      Sale.countDocuments(),
      Sale.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, revenue: { $sum: '$grandTotal' } } },
      ]),
    ]);

  const recentCompanies = await Company.find().sort({ createdAt: -1 }).limit(5);

  res.json({
    success: true,
    stats: {
      totalCompanies,
      activeCompanies,
      suspendedCompanies,
      totalUsers,
      totalProducts,
      totalSales,
      totalRevenue: revenueAgg[0]?.revenue || 0,
    },
    recentCompanies,
  });
});

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  updateCompanyStatus,
  deleteCompany,
  getAdminDashboard,
};
