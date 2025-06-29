// src/routes/toss.js
const express = require('express');
const router = express.Router();
const auth   = require('../middleware/authMiddleware');
const { toss } = require('../controllers/tossController');

/**
 * @openapi
 * /matches/{matchId}/toss:
 *   post:
 *     summary: Perform a toss for a match and broadcast result
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
 *         description: Toss result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TossResult'
 *       403: { description: Not match owner }
 *       500: { description: Toss failed }
 */
router.post('/matches/:matchId/toss', auth, toss);

module.exports = router;
