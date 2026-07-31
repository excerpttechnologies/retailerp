const mongoose = require('mongoose');

const stockLedgerSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment', 'transfer', 'opening'],
      required: true,
    },
    quantity: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reference: { type: String, trim: true },
    reason: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

stockLedgerSchema.index({ company: 1, product: 1, createdAt: -1 });

module.exports = mongoose.model('StockLedger', stockLedgerSchema);
