const mongoose = require('mongoose');

const freightDetailSchema = new mongoose.Schema(
  {
    totalFreight: { type: Number, default: 0 },
    freightType: { type: String, enum: ['INDIRECT EXP', 'DIRECT EXP', 'PAID', 'GST', 'PETTY CASH/CASH', ''], default: '' },
    inputCGST: { type: Number, default: 0 },
    inputSGST: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },
    totalFreightPayable: { type: Number, default: 0 },
  },
  { _id: false }
);

const transportSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    transactionNo: { type: String, required: true, unique: true, trim: true }, // e.g., LR/26/001
    transactionDate: { type: Date, required: true },
    transporter: { type: String, required: true, trim: true }, // Transporter/carrier name
    lrNumber: { type: String, required: true, trim: true }, // Lorry Receipt Number
    bookingDate: { type: Date, required: true },
    bookingDelay: { type: String, default: '' }, // e.g., "8 Days"
    supplierName: { type: String, required: true, trim: true },
    invNumber: { type: String, required: true, trim: true }, // Invoice number from supplier
    parcelQty: { type: Number, default: 0 },
    value: { type: Number, default: 0 }, // Invoice value
    freight: { type: freightDetailSchema, default: () => ({}) },
    autoCharges: { type: Number, default: 0 },
    tips: { type: Number, default: 0 },
    tipsType: { type: String, enum: ['INDIRECT EXP', 'DIRECT EXP', 'PAID', 'GST', 'PETTY CASH/CASH', ''], default: '' },
    gstApplicable: { type: Boolean, default: true },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

transportSchema.index({ company: 1, createdAt: -1 });
transportSchema.index({ company: 1, transactionNo: 1 });

module.exports = mongoose.model('Transport', transportSchema);
