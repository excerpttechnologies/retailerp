const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: 'General' },
    file: { type: String, required: true },
    linkedEntityType: { type: String, enum: ['none', 'customer', 'supplier', 'employee', 'product'], default: 'none' },
    linkedEntityId: { type: mongoose.Schema.Types.ObjectId },
    tags: { type: [String], default: [] },
    version: { type: Number, default: 1 },
    notes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

documentSchema.index({ name: 'text', category: 'text' });
documentSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
