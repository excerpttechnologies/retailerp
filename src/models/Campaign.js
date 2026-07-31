const mongoose = require('mongoose');

// Tracks marketing campaigns (name, channel, audience, schedule, status).
// This records and manages campaigns — it does not itself send SMS/email/
// WhatsApp messages, since that requires a real gateway integration
// (Twilio, SES, WhatsApp Business API, etc.) which is out of scope here.
const campaignSchema = new mongoose.Schema(
  {
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    name: { type: String, required: true, trim: true },
    channel: { type: String, enum: ['email', 'sms', 'whatsapp', 'push'], required: true },
    audienceSegment: { type: String, trim: true, default: 'All Customers' },
    message: { type: String, trim: true },
    scheduledDate: { type: Date },
    status: { type: String, enum: ['draft', 'scheduled', 'sent', 'cancelled'], default: 'draft' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

campaignSchema.index({ company: 1, createdAt: -1 });

module.exports = mongoose.model('Campaign', campaignSchema);
