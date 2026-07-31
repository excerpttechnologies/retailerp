const mongoose = require('mongoose');

// Generic dynamic master-data record. Powers many simple "list style" modules
// (Branches, Departments, Warehouses, Cost Centers, Chart of Accounts, Vehicles,
// Coupons, Brands, ...) from ONE schema, keyed by `moduleKey`. Field-level shape
// and validation for each moduleKey lives in `config/moduleRegistry.js` and is
// enforced in masterController.js — this keeps every module fully dynamic and
// database-backed without hand-rolling a new Mongoose model for every simple list.
const masterRecordSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    moduleKey: { type: String, required: true, index: true },
    fields: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

masterRecordSchema.index({ company: 1, moduleKey: 1, createdAt: -1 });

module.exports = mongoose.model('MasterRecord', masterRecordSchema);
