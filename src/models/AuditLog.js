const mongoose = require('mongoose');

// Captures create/update/delete actions across the v2 modules for compliance
// & activity-log reporting. Intentionally lightweight and append-only.
const auditLogSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    module: { type: String, required: true },
    action: { type: String, enum: ['create', 'update', 'delete', 'status_change'], required: true },
    recordId: { type: mongoose.Schema.Types.ObjectId },
    summary: { type: String },
  },
  { timestamps: true }
);

auditLogSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
