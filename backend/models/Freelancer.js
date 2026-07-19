const mongoose = require('mongoose');

const FreelancerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'] } // [cite: 35]
  }],
  portfolio: [{ title: String, url: String, description: String }], // [cite: 36]
  resumeUrl: { type: String }, // [cite: 37]
  experienceTimeline: [{ // [cite: 39]
    company: String,
    role: String,
    duration: String
  }],
  pricing: {
    hourlyRate: { type: Number }, // [cite: 41]
    milestoneMinimum: { type: Number } // [cite: 41]
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // Critical for Localized/Hyperlocal search! [cite: 32, 105]
  },
  reputationScore: { type: Number, default: 0 }, // [cite: 84]
  isVerifiedBadge: { type: Boolean, default: false }, // [cite: 42, 94]
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    slots: [{ type: String }]
  }]
});

module.exports = mongoose.model('Freelancer', FreelancerSchema);