const mongoose = require('mongoose');

const purchaseReturnItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    reason: { type: String, trim: true },
    amount: { type: Number, default: 0 },
  },
  { _id: false }
);

const purchaseReturnSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    returnNo: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    supplier: { type: String, required: true, trim: true },
    refType: { type: String, enum: ['PO', 'Invoice'], default: 'PO' },
    refNo: { type: String, trim: true },
    items: { type: [purchaseReturnItemSchema], default: [] },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['Pending', 'Processed'], default: 'Pending' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

purchaseReturnSchema.index({ company: 1, returnNo: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseReturn', purchaseReturnSchema);
