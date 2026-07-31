const mongoose = require('mongoose');

const ACTIONS = [
  'view', 'create', 'edit', 'delete', 'softDelete', 'restore',
  'export', 'import', 'approve', 'reject', 'print', 'download',
  'reports', 'dashboard', 'analytics', 'ai', 'settings', 'configure', 'manage',
];

const permissionSchema = new mongoose.Schema(
  {
    module: { type: String, required: true },
    actions: { type: [String], default: [], enum: ACTIONS },
  },
  { _id: false }
);

const roleSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    isSystem: { type: Boolean, default: false },
    permissions: { type: [permissionSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

roleSchema.index({ company: 1, name: 1 }, { unique: true });

roleSchema.statics.ACTIONS = ACTIONS;

module.exports = mongoose.model('Role', roleSchema);
