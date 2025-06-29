const Invite = require('../models/Invite');
const Match  = require('../models/Match');
const User   = require('../models/User');

// Send an invite
exports.sendInvite = async (req, res) => {
  try {
    const { matchId } = req.params;
    const { inviteeId } = req.body;
    const inviterId = req.user.userId;

    const match = await Match.findById(matchId);
    if (!match || match.owner.toString() !== inviterId)
      return res.status(403).json({ error: 'Not match owner' });

    const invitee = await User.findById(inviteeId);
    if (!invitee)
      return res.status(404).json({ error: 'Invitee not found' });

    const invite = await Invite.findOneAndUpdate(
      { match: matchId, invitee: inviteeId },
      { inviter: inviterId, status: 'pending', createdAt: Date.now() },
      { upsert: true, new: true }
    );

    res.status(201).json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send invite' });
  }
};

// List invites for current user
exports.listInvites = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invites = await Invite.find({ invitee: userId })
      .populate('match inviter', 'format date location displayName');
    res.json({ invites });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list invites' });
  }
};

// Respond to an invite
exports.respondInvite = async (req, res) => {
  try {
    const { inviteId } = req.params;
    const { action } = req.body;
    const userId = req.user.userId;

    if (!['accepted','declined'].includes(action))
      return res.status(400).json({ error: 'Invalid action' });

    const invite = await Invite.findById(inviteId);
    if (!invite || invite.invitee.toString() !== userId)
      return res.status(404).json({ error: 'Invite not found' });

    invite.status = action;
    await invite.save();

    if (action === 'accepted') {
      await Match.findByIdAndUpdate(invite.match, {
        $addToSet: { participants: userId }
      });
    }

    res.json(invite);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to respond to invite' });
  }
};
