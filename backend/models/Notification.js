const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['new_gig', 'proposal_accepted', 'proposal_rejected', 'payment_received', 'review_added', 'message_received', 'escrow_funded', 'milestone_completed'],
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Can reference gig, proposal, escrow, etc.
  relatedType: { type: String }, // 'gig', 'proposal', 'escrow', 'review', 'message'
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);
