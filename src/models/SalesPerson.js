const mongoose = require('mongoose');

const salesPersonSchema = new mongoose.Schema({
  company: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true,
    index: true 
  },
  staff: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Staff',
    required: true
  },
  spCode: { 
    type: String, 
    required: true,
    unique: true 
  },
  spName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String,
    lowercase: true,
    trim: true
  },
  mobile: { 
    type: String 
  },
  territory: { 
    type: String 
  },
  targetType: { 
    type: String, 
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  salesTarget: { 
    type: Number, 
    default: 0 
  },
  commissionRate: { 
    type: Number, 
    default: 0 
  }, // Percentage
  isDefault: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  performance: {
    totalSales: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    lastUpdated: Date
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

// Indexes
salesPersonSchema.index({ company: 1, spCode: 1 });
salesPersonSchema.index({ company: 1, isActive: 1 });
salesPersonSchema.index({ staff: 1 });

// Auto-generate SP code if not provided
salesPersonSchema.pre('save', async function(next) {
  if (!this.spCode) {
    const count = await this.constructor.countDocuments({ company: this.company });
    this.spCode = `SP${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Ensure only one default sales person per company
salesPersonSchema.pre('save', async function(next) {
  if (this.isDefault && this.isModified('isDefault')) {
    await this.constructor.updateMany(
      { company: this.company, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.model('SalesPerson', salesPersonSchema);
