const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ['individual', 'business'], default: 'individual' },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    address: addressSchema,
    customerGroup: { type: String, default: 'General' },
    loyaltyPoints: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    documents: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

customerSchema.index({ company: 1, phone: 1 }, { unique: true });
customerSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
