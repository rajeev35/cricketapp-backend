const Match = require('../models/Match');

// Create a new match
exports.createMatch = async (req, res) => {
  try {
    const { format, date, location } = req.body;
    if (!format || !date || !location) {
      return res.status(400).json({ error: 'format, date, and location are required' });
    }

    // req.user.userId set by authMiddleware
    const ownerId = req.user.userId;

    const match = await Match.create({
      format,
      date,
      location,
      owner: ownerId,
      participants: [ownerId],
    });

    return res.status(201).json(match);
  } catch (err) {
    console.error('Create match error:', err);
    return res.status(500).json({ error: 'Failed to create match' });
  }
};
exports.listMatches = async (req, res) => {
  try {
    
    const matches = await Match.find({
      participants: req.user.userId
    }).sort({ date: 1 });
    res.json(matches);
  } catch (err) {
    console.error('List matches error:', err);
    res.status(500).json({ error: 'Failed to load matches' });
  }
};


exports.deleteMatch = async (req, res) => {
  try {
    const { id } = req.params;
    const match = await Match.findById(id);
    if (!match) return res.status(404).json({ error: 'Match not found' });
    if (match.owner.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not allowed to delete this match' });
    }
    await match.deleteOne();
    res.json({ success: true });
  } catch (err) {
    console.error('Delete match error:', err);
    res.status(500).json({ error: 'Failed to delete match' });
  }
};