const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Made optional for OAuth users
  googleId: { type: String },
  role: { 
    type: String, 
    enum: ['Client', 'Freelancer', 'Admin'],
    required: true 
  },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
  suspensionReason: { type: String },
  suspendedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

module.exports = mongoose.model('User', UserSchema);