const mongoose = require('mongoose');

const attendanceOverrideSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    field: {
      type: String,
      enum: ['presentCount', 'absentCount', 'halfDayCount', 'checkedIn', 'checkedOut'],
      required: true,
    },
    value: { type: Number, required: true },
    setBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

attendanceOverrideSchema.index({ company: 1, month: 1, year: 1, field: 1 }, { unique: true });

module.exports = mongoose.model('AttendanceOverride', attendanceOverrideSchema);
