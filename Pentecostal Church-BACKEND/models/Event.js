const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    date:        { type: Date,   required: true },
    endDate:     { type: Date },
    location:    { type: String, default: 'RPC Nyamira' },
    category: {
      type: String,
      enum: ['Service', 'Revival', 'Concert', 'Conference', 'Outreach', 'Other'],
      default: 'Service',
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
