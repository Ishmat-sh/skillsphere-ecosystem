const User = require('../models/User');
const Gig = require('../models/Gig');
const Proposal = require('../models/Proposal');
const Escrow = require('../models/Escrow');
const Freelancer = require('../models/Freelancer');
const Client = require('../models/Client');

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (status === 'suspended') filter.isSuspended = true;
    if (status === 'active') filter.isSuspended = false;

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);
    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    let profileData = {};
    if (user.role === 'Freelancer') {
      profileData = await Freelancer.findOne({ user: user._id });
    } else if (user.role === 'Client') {
      profileData = await Client.findOne({ user: user._id });
    }

    res.json({ ...user.toObject(), profile: profileData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.suspendUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isSuspended = true;
    user.suspensionReason = reason || 'Violation of platform policies';
    user.suspendedAt = new Date();
    await user.save();

    res.json({ message: 'User suspended successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyFreelancer = async (req, res) => {
  try {
    const freelancer = await Freelancer.findOne({ user: req.params.id });
    if (!freelancer) return res.status(404).json({ message: 'Freelancer profile not found' });

    freelancer.isVerifiedBadge = true;
    await freelancer.save();

    res.json({ message: 'Freelancer verified successfully', freelancer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    
    if (user.role === 'Freelancer') {
      await Freelancer.findOneAndDelete({ user: req.params.id });
    } else if (user.role === 'Client') {
      await Client.findOneAndDelete({ user: req.params.id });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Gig management
exports.getAllGigs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const gigs = await Gig.find(filter)
      .populate('client', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Gig.countDocuments(filter);
    res.json({ gigs, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    gig.status = 'active';
    gig.isApproved = true;
    await gig.save();

    res.json({ message: 'Gig approved successfully', gig });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });

    await Gig.findByIdAndDelete(req.params.id);
    await Proposal.deleteMany({ gig: req.params.id });

    res.json({ message: 'Gig deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Payment monitoring
exports.getAllPayments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const escrows = await Escrow.find(filter)
      .populate('client', 'name email')
      .populate('freelancer', 'name email')
      .populate('gig', 'title')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Escrow.countDocuments(filter);
    res.json({ payments: escrows, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const stats = await Escrow.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalVolume = await Escrow.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({ stats, totalVolume: totalVolume[0]?.total || 0 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const gigStats = await Gig.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const proposalStats = await Proposal.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalRevenue = await Escrow.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);

    res.json({
      users: userStats,
      gigs: gigStats,
      proposals: proposalStats,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const { period = 'monthly' } = req.query;
    const groupBy = period === 'daily' ? 
      { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } } :
      { $dateToString: { format: '%Y-%m', date: '$createdAt' } };

    const revenue = await Escrow.aggregate([
      {
        $match: { status: 'completed' }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json(revenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dispute management (placeholder)
exports.getAllDisputes = async (req, res) => {
  try {
    // Placeholder for dispute system
    res.json({ disputes: [], message: 'Dispute system not yet implemented' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    // Placeholder for dispute resolution
    res.json({ message: 'Dispute resolution not yet implemented' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Activity logs (placeholder)
exports.getActivityLogs = async (req, res) => {
  try {
    // Placeholder for activity logging system
    res.json({ logs: [], message: 'Activity logging system not yet implemented' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
