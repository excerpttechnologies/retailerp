const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    itemName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    unit: { type: String, trim: true, default: 'pcs' },
    barcode: { type: String, trim: true },
    purchaseRate: { type: Number, default: 0 },
    sellingRate: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 0 },
    minStockLevel: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

inventoryItemSchema.index({ company: 1, barcode: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
