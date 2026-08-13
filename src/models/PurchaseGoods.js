const mongoose = require('mongoose');

const purchaseGoodsItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, trim: true },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const purchaseGoodsSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    poNumber: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    supplier: { type: String, required: true, trim: true },
    items: { type: [purchaseGoodsItemSchema], default: [] },
    grandTotal: { type: Number, default: 0 },
    status: { type: String, enum: ['Draft', 'Confirmed', 'Received'], default: 'Draft' },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

purchaseGoodsSchema.index({ company: 1, poNumber: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseGoods', purchaseGoodsSchema);
