const Escrow = require('../models/Escrow');
const Proposal = require('../models/Proposal');
const Gig = require('../models/Gig');
const Activity = require('../models/Activity');
const Client = require('../models/Client');

exports.getFreelancerAnalytics = async (req, res) => {
  try {
    const escrows = await Escrow.find({ freelancer: req.user.id });
    const proposals = await Proposal.find({ freelancer: req.user.id });

    const totalEarnings = escrows.reduce((sum, e) => sum + e.releasedAmount, 0);
    const pendingClearances = escrows.reduce(
      (sum, e) => sum + (e.lockedAmount - e.releasedAmount),
      0
    );
    const completedJobs = escrows.filter((e) => e.status === 'released').length;
    const totalJobs = escrows.length;
    const completionRate = totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0;

    const monthly = {};
    escrows.forEach((e) => {
      e.milestones
        .filter((m) => m.status === 'completed' && m.completedAt)
        .forEach((m) => {
          const key = new Date(m.completedAt).toLocaleString('default', { month: 'short' });
          monthly[key] = (monthly[key] || 0) + m.amount;
        });
    });

    res.json({
      totalEarnings,
      pendingClearances,
      completionRate,
      proposalsSubmitted: proposals.length,
      proposalsAccepted: proposals.filter((p) => p.status === 'Accepted').length,
      monthlyEarnings: monthly,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getClientAnalytics = async (req, res) => {
  try {
    const escrows = await Escrow.find({ client: req.user.id });
    const gigs = await Gig.find({ client: req.user.id });
    const client = await Client.findOne({ user: req.user.id });

    const activeContracts = escrows.filter((e) => e.status !== 'released').length;
    const spendingBreakdown = {};
    escrows.forEach((e) => {
      const cat = e.status;
      spendingBreakdown[cat] = (spendingBreakdown[cat] || 0) + e.totalAmount;
    });

    res.json({
      totalSpent: client?.spentTotal || 0,
      activeContracts,
      gigsPosted: gigs.length,
      gigsFilled: gigs.filter((g) => g.status === 'filled').length,
      spendingBreakdown,
      contractTimelines: escrows.map((e) => ({
        id: e._id,
        title: e.gig,
        status: e.status,
        progress: Math.round((e.releasedAmount / e.totalAmount) * 100),
        createdAt: e.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTicker = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(20);
    if (activities.length === 0) {
      return res.json([
        { message: 'React Developer just cleared a $500 milestone', amount: 500, createdAt: new Date() },
        { message: 'UI Designer locked a $1,200 escrow contract', amount: 1200, createdAt: new Date() },
        { message: 'Node.js Engineer completed a $800 delivery', amount: 800, createdAt: new Date() },
      ]);
    }
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
