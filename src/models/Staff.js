const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  staffCode: { 
    type: String, 
    required: true,
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  mobile: { 
    type: String 
  },
  role: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Role',
    required: true
  },
  department: { 
    type: String 
  },
  designation: { 
    type: String 
  },
  joiningDate: { 
    type: Date 
  },
  allowLogin: { 
    type: Boolean, 
    default: false 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }, // Linked user account if allowLogin = true
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  salary: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  profilePhoto: { 
    type: String 
  },
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: Date
  }],
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
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

// Indexes for performance
staffSchema.index({ company: 1, staffCode: 1 });
staffSchema.index({ company: 1, email: 1 });
staffSchema.index({ company: 1, isActive: 1 });
staffSchema.index({ role: 1 });

// Auto-generate staff code if not provided
staffSchema.pre('save', async function(next) {
  if (!this.staffCode) {
    const count = await this.constructor.countDocuments({ company: this.company });
    this.staffCode = `STAFF${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Staff', staffSchema);
