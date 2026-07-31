const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    sale: { type: mongoose.Schema.Types.ObjectId, ref: 'Sale', required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'MasterRecord' }, // references a "vehicles" master record
    driverName: { type: String, trim: true },
    address: { type: String, required: true, trim: true },
    status: { type: String, enum: ['pending', 'dispatched', 'delivered', 'failed'], default: 'pending' },
    dispatchedAt: { type: Date },
    deliveredAt: { type: Date },
    proofOfDelivery: { type: String, default: null },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

deliverySchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Delivery', deliverySchema);
