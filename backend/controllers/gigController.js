const Gig = require('../models/Gig');
const Client = require('../models/Client');

exports.createGig = async (req, res) => {
  try {
    const { title, description, budget, category, skills, deadline } = req.body;
    const gig = await Gig.create({
      title,
      description,
      budget,
      category,
      skills: skills || [],
      deadline,
      client: req.user.id,
    });

    await Client.findOneAndUpdate(
      { user: req.user.id },
      { $push: { postedGigs: gig._id } },
      { upsert: true }
    );

    const populatedGig = await Gig.findById(gig._id).populate('client', 'name email');
    const io = req.app.get('io');
    if (io) {
      io.emit('gig:new', populatedGig);
    }

    res.status(201).json(populatedGig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const { search, category, minBudget, maxBudget, skills, location, page = 1, limit = 10, sortBy = 'createdAt' } = req.query;
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseFloat(minBudget);
      if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
    }
    
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(',');
      filter.skills = { $in: skillArray };
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    // Note: Location-based search removed as it requires freelancer location data
    // which is not directly accessible on the Gig document. 
    // To implement geo-search properly, would need to:
    // 1. Add location field to Gig schema
    // 2. Or join with Freelancer collection via aggregation pipeline
    // 3. Or use a separate location index service

    const sortOptions = {};
    if (sortBy === 'budget') sortOptions.budget = 1;
    else if (sortBy === 'budget_desc') sortOptions.budget = -1;
    else if (sortBy === 'deadline') sortOptions.deadline = 1;
    else sortOptions.createdAt = -1;

    const gigs = await Gig.find(filter)
      .populate('client', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Gig.countDocuments(filter);
    
    res.json({ 
      gigs, 
      total, 
      page, 
      totalPages: Math.ceil(total / limit),
      hasMore: page < Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigById = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('client', 'name email');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyGigs = async (req, res) => {
  try {
    const gigs = await Gig.find({ client: req.user.id }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGig = async (req, res) => {
  try {
    const { title, description, budget, category, skills, deadline } = req.body;
    
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own gigs' });
    }
    
    const updatedGig = await Gig.findByIdAndUpdate(
      req.params.id,
      { title, description, budget, category, skills, deadline },
      { new: true }
    ).populate('client', 'name email');
    
    res.json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own gigs' });
    }
    
    if (gig.status !== 'draft') {
      return res.status(400).json({ message: 'Can only delete draft gigs' });
    }
    
    await Gig.findByIdAndDelete(req.params.id);
    await Client.findOneAndUpdate(
      { user: req.user.id },
      { $pull: { postedGigs: req.params.id } }
    );
    
    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateGigStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'active', 'closed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own gigs' });
    }
    
    gig.status = status;
    await gig.save();
    
    const updatedGig = await Gig.findById(req.params.id).populate('client', 'name email');
    res.json(updatedGig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
