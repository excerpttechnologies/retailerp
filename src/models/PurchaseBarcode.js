const mongoose = require('mongoose');

const purchaseBarcodeSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    barcodeCode: { type: String, required: true, unique: true, trim: true },
    itemName: { type: String, required: true, trim: true },
    subGroup: { type: String, required: true, trim: true },
    group: { type: String, required: true, trim: true },
    hsn: { type: String, required: true, trim: true },
    gstPercent: { type: Number, required: true, min: 0 },
    printItemDescription: { type: String, trim: true },
    stockPoint: { type: String, required: true, trim: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', default: null },
    createdDate: { type: Date, default: Date.now },
    pricing: {
      offerPriceEnabled: { type: Boolean, default: false },
      purchaseRate: { type: Number, default: 0 },
      discountType: { type: String, enum: ['Flat', 'Percentage', 'None'], default: 'None' },
      discount: { type: Number, default: 0 },
      finalPrice: { type: Number, default: 0 },
      isMtr: { type: Boolean, default: false },
      quantity: { type: Number, default: 1 },
      markupRSP: { type: Number, default: 0 },
      rspPrice: { type: Number, default: 0 },
      markupWSP: { type: Number, default: 0 },
      wspPrice: { type: Number, default: 0 },
      markupDP: { type: Number, default: 0 },
      dpPrice: { type: Number, default: 0 },
    },
    isInventoryItem: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseBarcode', purchaseBarcodeSchema);
