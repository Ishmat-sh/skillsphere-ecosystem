const Escrow = require('../models/Escrow');
const Activity = require('../models/Activity');
const Client = require('../models/Client');

const emitStatus = (req, event, payload) => {
  const io = req.app.get('io');
  if (io) {
    io.to(`user:${payload.clientId}`).emit(event, payload);
    io.to(`user:${payload.freelancerId}`).emit(event, payload);
  }
};

exports.getMyEscrows = async (req, res) => {
  try {
    const filter =
      req.user.role === 'Client'
        ? { client: req.user.id }
        : { freelancer: req.user.id };

    const escrows = await Escrow.find(filter)
      .populate('gig', 'title')
      .populate('freelancer', 'name email')
      .populate('client', 'name email')
      .sort({ createdAt: -1 });
    res.json(escrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeMilestone = async (req, res) => {
  try {
    const { escrowId, milestoneIndex } = req.params;
    const escrow = await Escrow.findById(escrowId).populate('gig');
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    // Only clients can complete milestones
    const isClient = escrow.client.toString() === req.user.id;
    if (!isClient) {
      return res.status(403).json({ message: 'Only clients can complete milestones' });
    }

    const idx = parseInt(milestoneIndex, 10);
    const milestone = escrow.milestones[idx];
    if (!milestone || milestone.status === 'completed') {
      return res.status(400).json({ message: 'Invalid milestone' });
    }

    milestone.status = 'completed';
    milestone.completedAt = new Date();
    escrow.releasedAmount += milestone.amount;

    const allDone = escrow.milestones.every((m) => m.status === 'completed');
    escrow.status = allDone ? 'released' : 'partial';
    await escrow.save();

    await Client.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { spentTotal: milestone.amount } }
    );

    await Activity.create({
      message: `Milestone "${milestone.title}" cleared — $${milestone.amount}`,
      amount: milestone.amount,
    });

    const populated = await Escrow.findById(escrow._id)
      .populate('gig', 'title')
      .populate('freelancer', 'name email')
      .populate('client', 'name email');

    emitStatus(req, 'contract:update', {
      clientId: escrow.client.toString(),
      freelancerId: escrow.freelancer.toString(),
      escrow: populated,
    });

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
