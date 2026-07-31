const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    contactPerson: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    gstNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    paymentTerms: { type: String, trim: true, default: 'Net 30' },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    documents: { type: [String], default: [] },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

supplierSchema.index({ company: 1, phone: 1 }, { unique: true });
supplierSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Supplier', supplierSchema);
