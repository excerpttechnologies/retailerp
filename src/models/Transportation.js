const mongoose = require('mongoose');

const transportationSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    // Transporter Details
    transporterName: { type: String, required: true, trim: true },
    transporterGSTIN: { type: String, trim: true },
    transporterSACCode: { type: String, trim: true },
    // Booking Details
    bookingNumber: { type: String, required: true, trim: true },
    bookingDate: { type: Date, required: true },
    deliveryDate: { type: Date },
    // Shipment Details
    invoiceNumber: { type: String, trim: true },
    invoiceValue: { type: Number, default: 0 },
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    descriptionOfGoods: { type: String, required: true, trim: true },
    // Parcel & Weight
    numberOfParcels: { type: Number, default: 1 },
    weightKgs: { type: Number, default: 0 },
    // Freight & Charges
    freightCharges: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    // Tax Calculations
    sgst: { type: Number, default: 9 }, // SGST percentage
    cgst: { type: Number, default: 9 }, // CGST percentage
    sgstAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    // Payment & Status
    modeOfPayment: { type: String, enum: ['TO PAY', 'PAID', 'TBB'], default: 'TO PAY' },
    status: { type: String, enum: ['PENDING', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'], default: 'PENDING' },
    // Documentation
    proofOfDelivery: { type: String }, // File path or URL
    remarks: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

transportationSchema.index({ company: 1, createdAt: -1 });
transportationSchema.index({ company: 1, bookingNumber: 1 });
transportationSchema.index({ company: 1, status: 1 });

module.exports = mongoose.model('Transportation', transportationSchema);
