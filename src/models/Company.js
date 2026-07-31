const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
  },
  { _id: false }
);

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    businessType: { type: String, trim: true },
    businessCategory: { type: String, trim: true },
    ownerName: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    alternatePhone: { type: String, trim: true },
    website: { type: String, trim: true },
    gstNumber: { type: String, trim: true },
    pan: { type: String, trim: true },
    taxNumber: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
    address: addressSchema,
    logo: { type: String, default: null },
    subscriptionPlan: {
      type: String,
      enum: ['trial', 'starter', 'professional', 'enterprise'],
      default: 'trial',
    },
    planValidity: { type: Date },
    status: {
      type: String,
      enum: ['active', 'suspended', 'inactive', 'pending'],
      default: 'pending',
    },
    timezone: { type: String, default: 'Asia/Kolkata' },
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

companySchema.index({ name: 'text', code: 'text', email: 'text' });

module.exports = mongoose.model('Company', companySchema);
