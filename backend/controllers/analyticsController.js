const Escrow = require('../models/Escrow');
const Proposal = require('../models/Proposal');
const Gig = require('../models/Gig');
const Activity = require('../models/Activity');
const Client = require('../models/Client');
const Review = require('../models/Review');
const Freelancer = require('../models/Freelancer');

exports.getFreelancerAnalytics = async (req, res) => {
  try {
    const escrows = await Escrow.find({ freelancer: req.user.id });
    const proposals = await Proposal.find({ freelancer: req.user.id });
    const reviews = await Review.find({ reviewee: req.user.id });
    const freelancer = await Freelancer.findOne({ user: req.user.id });

    const totalEarnings = escrows.reduce((sum, e) => sum + (e.releasedAmount || 0), 0);
    const pendingClearances = escrows.reduce(
      (sum, e) => sum + ((e.lockedAmount || 0) - (e.releasedAmount || 0)),
      0
    );
    const completedJobs = escrows.filter((e) => e.status === 'completed').length;
    const totalJobs = escrows.length;
    const completionRate = totalJobs ? Math.round((completedJobs / totalJobs) * 100) : 0;

    // Monthly earnings chart
    const monthlyEarnings = {};
    escrows.forEach((e) => {
      if (e.milestones) {
        e.milestones
          .filter((m) => m.status === 'completed' && m.completedAt)
          .forEach((m) => {
            const key = new Date(m.completedAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            monthlyEarnings[key] = (monthlyEarnings[key] || 0) + m.amount;
          });
      }
    });

    // Proposal statistics
    const proposalsSubmitted = proposals.length;
    const proposalsAccepted = proposals.filter((p) => p.status === 'Accepted').length;
    const proposalsRejected = proposals.filter((p) => p.status === 'Rejected').length;
    const proposalsPending = proposals.filter((p) => p.status === 'Pending').length;
    const acceptanceRate = proposalsSubmitted ? Math.round((proposalsAccepted / proposalsSubmitted) * 100) : 0;

    // Review analytics
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;
    const totalReviews = reviews.length;

    // Client feedback analytics
    const clientFeedback = {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      fiveStarReviews: reviews.filter(r => r.rating === 5).length,
      fourStarReviews: reviews.filter(r => r.rating === 4).length,
      threeStarReviews: reviews.filter(r => r.rating === 3).length,
      twoStarReviews: reviews.filter(r => r.rating === 2).length,
      oneStarReviews: reviews.filter(r => r.rating === 1).length,
    };

    // Profile views (placeholder - would need to implement view tracking)
    const profileViews = freelancer?.profileViews || 0;

    // Gig applications tracking
    const gigApplications = {
      total: proposalsSubmitted,
      accepted: proposalsAccepted,
      rejected: proposalsRejected,
      pending: proposalsPending,
      acceptanceRate,
    };

    // Revenue trends (last 6 months)
    const revenueTrends = [];
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      months.push(monthKey);
      revenueTrends.push({
        month: monthKey,
        earnings: monthlyEarnings[monthKey] || 0,
      });
    }

    res.json({
      totalEarnings,
      pendingClearances,
      completionRate,
      profileViews,
      gigApplications,
      monthlyEarnings,
      revenueTrends,
      clientFeedback,
      stats: {
        totalJobs,
        completedJobs,
        activeJobs: totalJobs - completedJobs,
        totalProposals: proposalsSubmitted,
      },
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
