const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    sku: { type: String },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    taxRate: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const saleSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    invoiceNumber: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', default: null },
    items: { type: [saleItemSchema], default: [] },
    subtotal: { type: Number, required: true, default: 0 },
    taxTotal: { type: Number, required: true, default: 0 },
    discountTotal: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true, default: 0 },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'wallet', 'credit', 'split'],
      default: 'cash',
    },
    paymentStatus: { type: String, enum: ['paid', 'pending', 'partial'], default: 'paid' },
    status: {
      type: String,
      enum: ['draft', 'completed', 'cancelled', 'returned'],
      default: 'completed',
    },
    channel: { type: String, enum: ['pos', 'online', 'wholesale'], default: 'pos' },
    notes: { type: String, trim: true },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

saleSchema.index({ company: 1, invoiceNumber: 1 }, { unique: true });
saleSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);
