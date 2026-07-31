const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    leaveType: { type: String, enum: ['sick', 'casual', 'earned', 'unpaid'], required: true },
    fromDate: { type: Date, required: true },
    toDate: { type: Date, required: true },
    reason: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

leaveRequestSchema.index({ company: 1, employee: 1, createdAt: -1 });

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
