const mongoose = require('mongoose');

// Simple cash-in / cash-out ledger. Can optionally reference a Sale, Purchase
// Order, or Customer/Supplier for reconciliation.
const paymentSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    type: { type: String, enum: ['received', 'made'], required: true },
    amount: { type: Number, required: true, min: 0 },
    method: { type: String, enum: ['cash', 'card', 'bank_transfer', 'upi', 'cheque'], default: 'cash' },
    referenceType: { type: String, enum: ['sale', 'purchase_order', 'customer', 'supplier', 'other'], default: 'other' },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceLabel: { type: String, trim: true },
    paymentDate: { type: Date, required: true, default: Date.now },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

paymentSchema.index({ company: 1, paymentDate: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
