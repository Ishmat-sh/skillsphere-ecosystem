const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  completedAt: { type: Date },
});

const EscrowSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  proposal: { type: mongoose.Schema.Types.ObjectId, ref: 'Proposal', required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalAmount: { type: Number, required: true },
  lockedAmount: { type: Number, required: true },
  releasedAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['locked', 'partial', 'released', 'funded', 'completed', 'refunded'], default: 'locked' },
  milestones: [MilestoneSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Escrow', EscrowSchema);
