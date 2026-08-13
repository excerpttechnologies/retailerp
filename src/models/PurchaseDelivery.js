const mongoose = require('mongoose');

const purchaseDeliveryItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 0 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
    barcode: { type: String, trim: true },
  },
  { _id: false }
);

const purchaseDeliverySchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    invoiceNo: { type: String, required: true, trim: true },
    date: { type: Date, default: Date.now },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    supplier: { type: String, required: true, trim: true },
    paymentType: { type: String, enum: ['Paid', 'Post Paid'], default: 'Paid' },
    items: { type: [purchaseDeliveryItemSchema], default: [] },
    subTotal: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    freightAmount: { type: Number, default: 0 },
    freight: {
      carrierName: { type: String, trim: true },
      amount: { type: Number, default: 0 },
      mode: { type: String, enum: ['Road', 'Rail', 'Air', 'Courier'], default: 'Road' },
      lrNumber: { type: String, trim: true },
      lrDate: { type: Date },
    },
    tips: {
      amount: { type: Number, default: 0 },
      remarks: { type: String, trim: true },
    },
    totalAmount: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    status: { type: String, enum: ['Draft', 'Confirmed', 'Paid', 'Cancelled'], default: 'Draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

purchaseDeliverySchema.index({ company: 1, invoiceNo: 1 }, { unique: true });

module.exports = mongoose.model('PurchaseDelivery', purchaseDeliverySchema);
