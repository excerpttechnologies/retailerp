const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema(
  {
    key: { type: String },
    label: { type: String },
    type: { type: String },
    sortable: { type: Boolean },
    exportable: { type: Boolean },
  },
  { _id: false }
);

const formFieldSchema = new mongoose.Schema(
  {
    key: { type: String },
    label: { type: String },
    type: { type: String },
    required: { type: Boolean },
    options: [{ type: String }],
    refModule: { type: String },
    placeholder: { type: String },
  },
  { _id: false }
);

const moduleConfigSchema = new mongoose.Schema(
  {
    moduleKey: { type: String, unique: true, required: true },
    section: { type: String, trim: true },
    icon: { type: String, trim: true },
    label: { type: String, trim: true, required: true },
    pageType: { type: String, enum: ['master', 'document', 'report', 'config', 'special'], default: 'master' },
    collectionName: { type: String, trim: true, default: 'MasterRecord' },
    columns: [columnSchema],
    formFields: [formFieldSchema],
    buttons: [String],
    permissions: [String],
    docNumbering: {
      prefix: String,
      resetPerFY: Boolean,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ModuleConfig', moduleConfigSchema);
