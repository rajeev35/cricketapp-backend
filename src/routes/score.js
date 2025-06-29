// src/routes/score.js
const express = require('express');
const router = express.Router();
const auth   = require('../middleware/authMiddleware');
const { getScore } = require('../controllers/scoreController');

/**
 * @openapi
 * /matches/{matchId}/score:
 *   get:
 *     summary: Get the latest score for a match
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Current score
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Score'
 */
router.get('/matches/:matchId/score', auth, getScore);

module.exports = router;
