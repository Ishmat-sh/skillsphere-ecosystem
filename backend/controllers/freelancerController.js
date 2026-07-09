const Freelancer = require('../models/Freelancer');
const User = require('../models/User');

// Portfolio management
exports.getPortfolio = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    res.json(freelancer.portfolio || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addPortfolioItem = async (req, res) => {
  try {
    const { title, url, description } = req.body;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $push: { portfolio: { title, url, description } } },
      { new: true, upsert: true }
    );
    
    res.status(201).json(freelancer.portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePortfolioItem = async (req, res) => {
  try {
    const { title, url, description } = req.body;
    const { itemId } = req.params;
    
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    const itemIndex = freelancer.portfolio.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) return res.status(404).json({ message: 'Portfolio item not found' });
    
    if (title) freelancer.portfolio[itemIndex].title = title;
    if (url) freelancer.portfolio[itemIndex].url = url;
    if (description) freelancer.portfolio[itemIndex].description = description;
    
    await freelancer.save();
    res.json(freelancer.portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { portfolio: { _id: itemId } } },
      { new: true }
    );
    
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    res.json(freelancer.portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Skills management
exports.getSkills = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    res.json(freelancer.skills || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { name, proficiency } = req.body;
    
    if (!name || !proficiency) {
      return res.status(400).json({ message: 'Name and proficiency are required' });
    }
    
    if (!['Beginner', 'Intermediate', 'Expert'].includes(proficiency)) {
      return res.status(400).json({ message: 'Invalid proficiency level' });
    }
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $push: { skills: { name, proficiency } } },
      { new: true, upsert: true }
    );
    
    res.status(201).json(freelancer.skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { name, proficiency } = req.body;
    const { skillId } = req.params;
    
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    const skillIndex = freelancer.skills.findIndex(skill => skill._id.toString() === skillId);
    if (skillIndex === -1) return res.status(404).json({ message: 'Skill not found' });
    
    if (name) freelancer.skills[skillIndex].name = name;
    if (proficiency) {
      if (!['Beginner', 'Intermediate', 'Expert'].includes(proficiency)) {
        return res.status(400).json({ message: 'Invalid proficiency level' });
      }
      freelancer.skills[skillIndex].proficiency = proficiency;
    }
    
    await freelancer.save();
    res.json(freelancer.skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );
    
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    res.json(freelancer.skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Experience management
exports.getExperience = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    res.json(freelancer.experienceTimeline || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addExperience = async (req, res) => {
  try {
    const { company, role, duration } = req.body;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $push: { experienceTimeline: { company, role, duration } } },
      { new: true, upsert: true }
    );
    
    res.status(201).json(freelancer.experienceTimeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExperience = async (req, res) => {
  try {
    const { company, role, duration } = req.body;
    const { expId } = req.params;
    
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    const expIndex = freelancer.experienceTimeline.findIndex(exp => exp._id.toString() === expId);
    if (expIndex === -1) return res.status(404).json({ message: 'Experience not found' });
    
    if (company) freelancer.experienceTimeline[expIndex].company = company;
    if (role) freelancer.experienceTimeline[expIndex].role = role;
    if (duration) freelancer.experienceTimeline[expIndex].duration = duration;
    
    await freelancer.save();
    res.json(freelancer.experienceTimeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExperience = async (req, res) => {
  try {
    const { expId } = req.params;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { experienceTimeline: { _id: expId } } },
      { new: true }
    );
    
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    
    res.json(freelancer.experienceTimeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Pricing management
exports.getPricing = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    res.json(freelancer.pricing || { hourlyRate: 0, milestoneMinimum: 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updatePricing = async (req, res) => {
  try {
    const { hourlyRate, milestoneMinimum } = req.body;
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      { 
        $set: { 
          'pricing.hourlyRate': hourlyRate,
          'pricing.milestoneMinimum': milestoneMinimum
        } 
      },
      { new: true, upsert: true }
    );
    
    res.json(freelancer.pricing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Profile management
exports.getFreelancerProfile = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.user.id })
      .populate('user', 'name email avatar');
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateFreelancerProfile = async (req, res) => {
  try {
    const { resumeUrl, location } = req.body;
    
    const updateData = {};
    if (resumeUrl) updateData.resumeUrl = resumeUrl;
    if (location && location.coordinates) {
      updateData.location = {
        type: 'Point',
        coordinates: location.coordinates
      };
    }
    
    const freelancer = await Freelancer.findOneAndUpdate(
      { user: req.user.id },
      updateData,
      { new: true, upsert: true }
    );
    
    res.json(freelancer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
