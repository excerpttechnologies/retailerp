const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema(
  {
    mrp: { type: Number, default: 0 },
    sellingPrice: { type: Number, default: 0, required: true },
    wholesalePrice: { type: Number, default: 0 },
    dealerPrice: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    barcode: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    brand: { type: String, trim: true },
    unit: { type: String, default: 'PCS' },
    description: { type: String, trim: true },
    images: { type: [String], default: [] },
    pricing: { type: pricingSchema, default: () => ({}) },
    taxRate: { type: Number, default: 0 },
    reorderLevel: { type: Number, default: 5 },
    stockQty: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({ company: 1, sku: 1 }, { unique: true });
productSchema.index({ name: 'text', sku: 'text', barcode: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
