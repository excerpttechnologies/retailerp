const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    paidTo: { type: String, trim: true },
    paymentMethod: { type: String, enum: ['cash', 'card', 'bank_transfer', 'upi', 'cheque'], default: 'cash' },
    expenseDate: { type: Date, required: true, default: Date.now },
    attachment: { type: String, default: null },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

expenseSchema.index({ company: 1, expenseDate: -1 });

module.exports = mongoose.model('Expense', expenseSchema);
