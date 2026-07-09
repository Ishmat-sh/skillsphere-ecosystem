const Proposal = require('../models/Proposal');
const Gig = require('../models/Gig');
const Escrow = require('../models/Escrow');
const Activity = require('../models/Activity');
const { createNotification } = require('./notificationController');

const emitStatus = (req, event, payload) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${payload.clientId}`).emit(event, payload);
    io.to(`user:${payload.freelancerId}`).emit(event, payload);
  }
};

exports.submitProposal = async (req, res) => {
  try {
    const { gigId } = req.params;
    const { quote, deliveryTimeline, coverLetter } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig || gig.status !== 'active') {
      return res.status(404).json({ message: 'Gig not available' });
    }

    const existing = await Proposal.findOne({ gig: gigId, freelancer: req.user.id });
    if (existing) return res.status(400).json({ message: 'Proposal already submitted' });

    const proposal = await Proposal.create({
      gig: gigId,
      freelancer: req.user.id,
      quote,
      deliveryTimeline,
      coverLetter,
    });

    const populated = await Proposal.findById(proposal._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title');

    emitStatus(req, 'proposal:update', {
      clientId: gig.client.toString(),
      freelancerId: req.user.id,
      proposal: populated,
    });

    // Create notification for client
    await createNotification(
      gig.client.toString(),
      'new_gig',
      'New Proposal Received',
      `${populated.freelancer.name} has submitted a proposal for "${populated.gig.title}"`,
      proposal._id,
      'proposal'
    );

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProposalsForGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.gigId);
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const proposals = await Proposal.find({ gig: req.params.gigId })
      .populate('freelancer', 'name email')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user.id })
      .populate('gig', 'title budget status')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProposalStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const proposal = await Proposal.findById(req.params.id).populate('gig');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const gig = await Gig.findById(proposal.gig._id || proposal.gig);
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    proposal.status = status;
    await proposal.save();

    if (status === 'Rejected') {
      await Proposal.updateMany(
        { gig: gig._id, _id: { $ne: proposal._id }, status: 'Pending' },
        { status: 'Pending' }
      );
    }

    const populated = await Proposal.findById(proposal._id)
      .populate('freelancer', 'name email')
      .populate('gig', 'title');

    emitStatus(req, 'proposal:update', {
      clientId: gig.client.toString(),
      freelancerId: proposal.freelancer.toString(),
      proposal: populated,
    });

    // Create notification for freelancer
    const notificationType = status === 'Accepted' ? 'proposal_accepted' : 'proposal_rejected';
    const notificationTitle = status === 'Accepted' ? 'Proposal Accepted!' : 'Proposal Rejected';
    const notificationMessage = status === 'Accepted' 
      ? `Your proposal for "${gig.title}" has been accepted!`
      : `Your proposal for "${gig.title}" has been rejected.`;
    
    await createNotification(
      proposal.freelancer.toString(),
      notificationType,
      notificationTitle,
      notificationMessage,
      proposal._id,
      'proposal'
    );

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.hireAndLockEscrow = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('gig');
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    const gig = await Gig.findById(proposal.gig._id || proposal.gig);
    if (gig.client.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    if (proposal.status !== 'Pending') {
      return res.status(400).json({ message: 'Proposal is not pending' });
    }

    proposal.status = 'Accepted';
    await proposal.save();

    await Proposal.updateMany(
      { gig: gig._id, _id: { $ne: proposal._id } },
      { status: 'Rejected' }
    );

    gig.status = 'filled';
    await gig.save();

    const milestones = [
      { title: 'Project Kickoff', amount: Math.round(proposal.quote * 0.3) },
      { title: 'Mid Delivery', amount: Math.round(proposal.quote * 0.4) },
      { title: 'Final Delivery', amount: proposal.quote - Math.round(proposal.quote * 0.3) - Math.round(proposal.quote * 0.4) },
    ];

    const escrow = await Escrow.create({
      gig: gig._id,
      proposal: proposal._id,
      client: req.user.id,
      freelancer: proposal.freelancer,
      totalAmount: proposal.quote,
      lockedAmount: proposal.quote,
      milestones,
    });

    await Activity.create({
      message: `${gig.title} escrow locked for $${proposal.quote}`,
      amount: proposal.quote,
    });

    const populated = await Escrow.findById(escrow._id)
      .populate('gig', 'title')
      .populate('freelancer', 'name email')
      .populate('client', 'name email');

    emitStatus(req, 'contract:update', {
      clientId: req.user.id,
      freelancerId: proposal.freelancer.toString(),
      escrow: populated,
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
