// src/routes/match.js
const express = require('express');
const router  = express.Router();
const authMiddleware    = require('../middleware/authMiddleware');
const {
  createMatch,
  listMatches,
  deleteMatch,
} = require('../controllers/matchController');

/**
 * @openapi
 * /matches:
 *   get:
 *     summary: List all matches for the authenticated user
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of Match objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 */
router.get('/', authMiddleware, listMatches);

/**
 * @openapi
 * /matches:
 *   post:
 *     summary: Create a new cricket match
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Match details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MatchInput'
 *     responses:
 *       '201':
 *         description: Match created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 */
router.post('/', authMiddleware, createMatch);

/**
 * @openapi
 * /matches/{id}:
 *   delete:
 *     summary: Delete a match by ID
 *     tags:
 *       - Matches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mongo ID of the match to delete
 *     responses:
 *       '200':
 *         description: Successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (not owner)
 *       '404':
 *         description: Match not found
 *       '500':
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deleteMatch);

module.exports = router;
