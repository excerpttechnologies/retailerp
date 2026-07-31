const asyncHandler = require('express-async-handler');
const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

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

  const [today, month, year, pendingOrders, cancelledOrders, totalProducts, totalCustomers] = await Promise.all([
    revenueBetween(startOfDay(now)),
    revenueBetween(startOfMonth(now)),
    revenueBetween(startOfYear(now)),
    Sale.countDocuments({ company: companyId, status: 'draft' }),
    Sale.countDocuments({ company: companyId, status: 'cancelled' }),
    Product.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
    Customer.countDocuments({ company: companyId, isDeleted: { $ne: true } }),
  ]);

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
      totalCustomers,
    },
    topProducts,
    salesTrend,
    lowStockProducts,
  });
});

module.exports = { getCompanyDashboard };
