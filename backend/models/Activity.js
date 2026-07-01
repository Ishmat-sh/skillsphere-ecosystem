const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  type: { type: String, default: 'milestone' },
  message: { type: String, required: true },
  amount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', ActivitySchema);
