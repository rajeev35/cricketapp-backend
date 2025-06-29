// src/routes/match.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createMatch } = require('../controllers/matchController');

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
 *             type: object
 *             required:
 *               - format
 *               - date
 *               - location
 *             properties:
 *               format:
 *                 type: string
 *                 example: T20
 *               date:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-07-05T15:30:00Z
 *               location:
 *                 type: string
 *                 example: Mumbai Ground
 *     responses:
 *       '201':
 *         description: Match created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       '400':
 *         description: Missing required fields
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Server error
 */
router.post('/', authMiddleware, createMatch);

module.exports = router;
