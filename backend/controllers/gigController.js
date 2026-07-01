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

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getGigs = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = { status: 'active' };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    const gigs = await Gig.find(filter)
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
    res.json(gigs);
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
