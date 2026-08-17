const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');
const Employee = require('../models/Employee');
const Category = require('../models/Category');
const Transport = require('../models/Transport');
const MasterRecord = require('../models/MasterRecord');
const mongoose = require('mongoose');

const TRANSPORTER_MODULE_KEY = 'logistic/logistic/transport';

const scopeCompany = (req) => req.user.company?._id || req.user.company;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);

// @desc  Company operational dashboard: sales KPIs, top products, low stock, sales trend
// @route GET /api/dashboard
const getCompanyDashboard = asyncHandler(async (req, res) => {
  const companyId = new mongoose.Types.ObjectId(scopeCompany(req));
  const now = new Date();

  const revenueBetween = async (from) => {
    const agg = await Sale.aggregate([
      { $match: { company: companyId, status: 'completed', createdAt: { $gte: from } } },
      { $group: { _id: null, revenue: { $sum: '$grandTotal' }, orders: { $sum: 1 } } },
    ]);
    return { revenue: agg[0]?.revenue || 0, orders: agg[0]?.orders || 0 };
  };

  const [
    today,
    month,
    year,
    pendingOrders,
    cancelledOrders,
    totalProducts,
    activeProducts,
    outOfStockProducts,
    totalCustomers,
    totalSuppliers,
    totalEmployees,
    totalCategories,
    totalTransporters,
    transportStats,
  ] = await Promise.all([
    revenueBetween(startOfDay(now)),
    revenueBetween(startOfMonth(now)),
    revenueBetween(startOfYear(now)),
    Sale.countDocuments({ company: companyId, status: 'draft' }),
    Sale.countDocuments({ company: companyId, status: 'cancelled' }),
    Product.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    Product.countDocuments({ company: companyId, isDeleted: { $ne: true }, status: 'active' }),
    Product.countDocuments({ company: companyId, isDeleted: { $ne: true }, stockQty: { $lte: 0 } }),
    Customer.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    Supplier.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    Employee.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    Category.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    MasterRecord.countDocuments({ company: companyId, moduleKey: TRANSPORTER_MODULE_KEY, isDeleted: { $ne: true } }),
    Transport.aggregate([
      { $match: { company: companyId } },
      {
        $group: {
          _id: null,
          totalRecords: { $sum: 1 },
          totalValue: { $sum: '$value' },
          totalFreight: { $sum: '$freight.totalFreight' },
        },
      },
    ]),
  ]);

  const deliverySummary = transportStats[0] || { totalRecords: 0, totalValue: 0, totalFreight: 0 };

  // Freight-type distribution across delivery/LR bookings — powers the
  // Transportation pie/donut chart on the dashboard with real data.
  const freightByType = await Transport.aggregate([
    { $match: { company: companyId } },
    {
      $group: {
        _id: { $ifNull: ['$freight.freightType', 'Unspecified'] },
        count: { $sum: 1 },
        totalFreight: { $sum: '$freight.totalFreight' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  // Most recent LR / delivery bookings — powers the "Recent Deliveries" table.
  const recentDeliveries = await Transport.find({ company: companyId })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('transactionNo transporter supplierName value bookingDate createdAt');

  const topProducts = await Sale.aggregate([
    { $match: { company: companyId, status: 'completed' } },
    { $unwind: '$items' },
    { $group: { _id: '$items.product', name: { $first: '$items.name' }, qtySold: { $sum: '$items.qty' }, revenue: { $sum: '$items.total' } } },
    { $sort: { qtySold: -1 } },
    { $limit: 5 },
  ]);

  const salesTrend = await Sale.aggregate([
    { $match: { company: companyId, status: 'completed', createdAt: { $gte: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$grandTotal' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const lowStockProducts = await Product.find({
    company: companyId,
    isDeleted: { $ne: true },
    $expr: { $lte: ['$stockQty', '$reorderLevel'] },
  })
    .select('name sku stockQty reorderLevel')
    .limit(10);

  res.json({
    success: true,
    kpis: {
      todaySales: today.revenue,
      todayOrders: today.orders,
      monthSales: month.revenue,
      monthOrders: month.orders,
      yearSales: year.revenue,
      yearOrders: year.orders,
      pendingOrders,
      cancelledOrders,
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockCount: lowStockProducts.length,
      totalCustomers,
      totalSuppliers,
      totalEmployees,
      totalCategories,
      totalTransporters,
      totalDeliveries: deliverySummary.totalRecords,
      deliveryValue: deliverySummary.totalValue,
      deliveryFreight: deliverySummary.totalFreight,
    },
    topProducts,
    salesTrend,
    lowStockProducts,
    freightByType,
    recentDeliveries,
  });
});

module.exports = { getCompanyDashboard };
