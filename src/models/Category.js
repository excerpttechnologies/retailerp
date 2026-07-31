const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    description: { type: String, trim: true },
    image: { type: String, default: null },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

categorySchema.index({ company: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Category', categorySchema);
