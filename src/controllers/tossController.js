// src/controllers/tossController.js
const Match = require('../models/Match');

exports.toss = async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user.userId;
    const match = await Match.findById(matchId);
    if (!match || match.owner.toString() !== userId) {
      return res.status(403).json({ error: 'Not match owner' });
    }

    // Flip coin
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const timestamp = new Date();

    // Emit via Socket.IO (attach io to req.app)
    req.app.get('io').to(matchId).emit('tossResult', { matchId, result, timestamp });

    return res.json({ matchId, result, timestamp });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Toss failed' });
  }
};
