const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quote: { type: Number, required: true },
  deliveryTimeline: { type: String, required: true },
  coverLetter: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Proposal', ProposalSchema);
