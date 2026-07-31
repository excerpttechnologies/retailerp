const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    name: { type: String, required: true, trim: true },
    employeeCode: { type: String, required: true, trim: true, uppercase: true },
    designation: { type: String, trim: true },
    department: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    joiningDate: { type: Date, required: true, default: Date.now },
    salary: { type: Number, default: 0 },
    address: { type: String, trim: true },
    documents: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'inactive', 'exited'], default: 'active' },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

employeeSchema.index({ company: 1, employeeCode: 1 }, { unique: true });
employeeSchema.index({ name: 'text', email: 'text', phone: 'text' });

module.exports = mongoose.model('Employee', employeeSchema);
