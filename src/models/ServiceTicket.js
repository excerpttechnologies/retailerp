const mongoose = require('mongoose');

const serviceTicketSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    ticketNumber: { type: String, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    subject: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    resolutionNotes: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

serviceTicketSchema.index({ company: 1, ticketNumber: 1 }, { unique: true });

module.exports = mongoose.model('ServiceTicket', serviceTicketSchema);
