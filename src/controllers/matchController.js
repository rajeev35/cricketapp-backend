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
