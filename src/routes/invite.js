const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const {
  sendInvite,
  listInvites,
  respondInvite
} = require('../controllers/inviteController');

/**
 * @openapi
 * /matches/{matchId}/invite:
 *   post:
 *     summary: Send an invite for a match
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [inviteeId]
 *             properties:
 *               inviteeId:
 *                 type: string
 *     responses:
 *       201: { description: 'Invite created' }
 *       403: { description: 'Not match owner' }
 *       404: { description: 'Invitee not found' }
 *       500: { description: 'Failed to send invite' }
 */
router.post('/matches/:matchId/invite', auth, sendInvite);

/**
 * @openapi
 * /invites:
 *   get:
 *     summary: List pending invites for the user
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: 'List of invites' }
 *       500: { description: 'Failed to list invites' }
 */
router.get('/invites', auth, listInvites);

/**
 * @openapi
 * /invites/{inviteId}/respond:
 *   post:
 *     summary: Accept or decline an invite
 *     tags: [Invites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: inviteId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [action]
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accepted, declined]
 *     responses:
 *       200: { description: 'Invite updated' }
 *       400: { description: 'Invalid action' }
 *       404: { description: 'Invite not found' }
 *       500: { description: 'Failed to respond to invite' }
 */
router.post('/invites/:inviteId/respond', auth, respondInvite);

module.exports = router;
