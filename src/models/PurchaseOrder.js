const mongoose = require('mongoose');

const poItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String },
    qty: { type: Number, required: true, min: 1 },
    costPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    receivedQty: { type: Number, default: 0 },
  },
  { _id: false }
);

const purchaseOrderSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    poNumber: { type: String, required: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    items: { type: [poItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ['draft', 'sent', 'partially_received', 'received', 'cancelled'],
      default: 'draft',
    },
    expectedDate: { type: Date },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

purchaseOrderSchema.index({ company: 1, poNumber: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseOrder', purchaseOrderSchema);
