const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, trim: true },
    avatar: { type: String, default: null },
    isSuperAdmin: { type: Boolean, default: false },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', default: null },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role', default: null },
    status: { type: String, enum: ['active', 'inactive', 'locked'], default: 'active' },
    lastLogin: { type: Date },
    refreshToken: { type: String, select: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, company: 1 }, { unique: true });

userSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function matchPassword(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
