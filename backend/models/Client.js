const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String },
  postedGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
  spentTotal: { type: Number, default: 0 }
});

module.exports = mongoose.model('Client', ClientSchema);