require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const connectDB = require('./src/config/db');
const seedModuleConfigs = require('./src/seed/seedModuleConfigs');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/companyRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const userRoutes = require('./src/routes/userRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const customerRoutes = require('./src/routes/customerRoutes');
const inventoryRoutes = require('./src/routes/inventoryRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');

// --- v2 milestone additions (new modules only, nothing above this line changed) ---
const masterRoutes = require('./src/routes/masterRoutes');
const auditLogRoutes = require('./src/routes/auditLogRoutes');
const supplierRoutes = require('./src/routes/supplierRoutes');
const purchaseOrderRoutes = require('./src/routes/purchaseOrderRoutes');
const expenseRoutes = require('./src/routes/expenseRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');
const employeeRoutes = require('./src/routes/employeeRoutes');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const leaveRequestRoutes = require('./src/routes/leaveRequestRoutes');
const warrantyRoutes = require('./src/routes/warrantyRoutes');
const serviceTicketRoutes = require('./src/routes/serviceTicketRoutes');
const campaignRoutes = require('./src/routes/campaignRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const deliveryRoutes = require('./src/routes/deliveryRoutes');

const app = express();

const startServer = async () => {
  try {
    await connectDB();

    try {
      await seedModuleConfigs();
    } catch (seedErr) {
      console.warn('[Seed] ModuleConfig sync failed:', seedErr.message);
      console.warn('[Seed] Server will continue using moduleRegistry.seed.js fallback.');
    }

    app.use(helmet({ crossOriginResourcePolicy: false }));
    app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

    app.use(compression());
    app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(mongoSanitize());

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      // Increase limit during development to avoid accidental 429s from local tooling
      max: process.env.NODE_ENV === 'production' ? 500 : 10000,
      standardHeaders: true,
      legacyHeaders: false,
    });
    app.use('/api', limiter);

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.get('/api/health', (req, res) => {
      res.json({ success: true, message: 'GrooERP API is running', timestamp: new Date().toISOString() });
    });

    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/roles', roleRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/customers', customerRoutes);
    app.use('/api/inventory', inventoryRoutes);
    app.use('/api/sales', saleRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    app.use('/api/master', masterRoutes);
    app.use('/api/audit-logs', auditLogRoutes);
    app.use('/api/suppliers', supplierRoutes);
    app.use('/api/purchase-orders', purchaseOrderRoutes);
    app.use('/api/expenses', expenseRoutes);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/employees', employeeRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/leave-requests', leaveRequestRoutes);
    app.use('/api/warranties', warrantyRoutes);
    app.use('/api/service-tickets', serviceTicketRoutes);
    app.use('/api/campaigns', campaignRoutes);
    app.use('/api/documents', documentRoutes);
    app.use('/api/deliveries', deliveryRoutes);

    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`[GrooERP] Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (err) {
    console.error('[GrooERP] Startup failed:', err.message);
    if (process.env.NODE_ENV !== 'production') console.error(err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
