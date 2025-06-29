// src/routes/test.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @openapi
 * /test/protected:
 *   get:
 *     summary: Protected test endpoint
 *     tags:
 *       - Test
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Returns user info from the token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   description: Decoded JWT payload
 */
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
