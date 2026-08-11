const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  roleName: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  permissions: [{
    module: { type: String },
    actions: [{ type: String }] // ['view', 'create', 'edit', 'delete']
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isSystemRole: { 
    type: Boolean, 
    default: false 
  }, // Cannot be deleted
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true
});

// Index for faster lookups
roleSchema.index({ company: 1, roleName: 1 });
roleSchema.index({ company: 1, isActive: 1 });

// Prevent deletion of system roles
roleSchema.pre('remove', function(next) {
  if (this.isSystemRole) {
    return next(new Error('System roles cannot be deleted'));
  }
  next();
});

module.exports = mongoose.model('Role', roleSchema);
