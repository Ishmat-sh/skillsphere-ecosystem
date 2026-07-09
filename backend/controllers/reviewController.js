const Review = require('../models/Review');
const Escrow = require('../models/Escrow');
const Freelancer = require('../models/Freelancer');
const Activity = require('../models/Activity');

exports.submitReview = async (req, res) => {
  try {
    const { escrowId, rating, comment } = req.body;

    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ message: 'Escrow contract not found' });

    if (escrow.status !== 'released') {
      return res.status(400).json({ message: 'Cannot review until the contract is fully released' });
    }

    const isClient = escrow.client.toString() === req.user.id;
    const isFreelancer = escrow.freelancer.toString() === req.user.id;
    if (!isClient && !isFreelancer) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const reviewerId = req.user.id;
    const revieweeId = isClient ? escrow.freelancer : escrow.client;

    // Check if reviewer already reviewed this escrow
    const existing = await Review.findOne({ escrow: escrowId, reviewer: reviewerId });
    if (existing) return res.status(400).json({ message: 'You have already reviewed this contract' });

    const review = await Review.create({
      escrow: escrowId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    });

    // Update reputation score of the reviewee if they are a Freelancer
    if (isClient) {
      const allReviews = await Review.find({ reviewee: revieweeId });
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      const score = Math.round(avg * 20); // 0 to 100 scale

      await Freelancer.findOneAndUpdate(
        { user: revieweeId },
        { reputationScore: score },
        { upsert: true }
      );
    }

    await Activity.create({
      message: `New review submitted — Rating: ${rating}/5`,
      amount: 0,
    });

    const populated = await Review.findById(review._id)
      .populate('reviewer', 'name role')
      .populate('reviewee', 'name role');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name role')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
