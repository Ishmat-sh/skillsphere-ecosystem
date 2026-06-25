const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Client', 'Freelancer', 'Admin'], // [cite: 11, 12, 13, 14]
    required: true 
  },
  isVerified: { type: Boolean, default: false }, // [cite: 19]
  twoFactorEnabled: { type: Boolean, default: false }, // [cite: 21]
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);