const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeCode: { type: String, trim: true },
    employeeName: { type: String, trim: true },
    department: { type: String, trim: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['present', 'absent', 'half_day', 'leave', 'holiday'], required: true },
    checkIn: { type: String },
    checkOut: { type: String },
    totalHours: { type: Number, default: 0 },
    notes: { type: String, trim: true },
    isManualEntry: { type: Boolean, default: false },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

attendanceSchema.index(
  { company: 1, employee: 1, date: 1 },
  { unique: true, partialFilterExpression: { isActive: true } }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
