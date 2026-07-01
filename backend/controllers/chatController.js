const Message = require('../models/Message');
const Escrow = require('../models/Escrow');

exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const escrow = await Escrow.findById(roomId);
    if (!escrow) return res.status(404).json({ message: 'Contract not found' });

    const allowed =
      escrow.client.toString() === req.user.id ||
      escrow.freelancer.toString() === req.user.id;
    if (!allowed) return res.status(403).json({ message: 'Forbidden' });

    const messages = await Message.find({ roomId })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChatRooms = async (req, res) => {
  try {
    const filter =
      req.user.role === 'Client'
        ? { client: req.user.id }
        : { freelancer: req.user.id };

    const escrows = await Escrow.find(filter)
      .populate('gig', 'title')
      .populate('freelancer', 'name')
      .populate('client', 'name');
    res.json(escrows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
