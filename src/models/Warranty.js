const mongoose = require('mongoose');

const warrantySchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale' },
    serialNumber: { type: String, trim: true },
    purchaseDate: { type: Date, required: true },
    warrantyMonths: { type: Number, required: true, default: 12 },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'expired', 'void'], default: 'active' },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

warrantySchema.index({ company: 1, expiryDate: 1 });

module.exports = mongoose.model('Warranty', warrantySchema);
