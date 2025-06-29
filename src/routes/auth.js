// src/routes/auth.js
const express = require('express');
const router  = express.Router();
const {
  register,
  emailLogin,
  requestOtp,
  verifyOtp,
  loginWithIdToken,
} = require('../controllers/authController');

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user via email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@cricketapp.com"
 *               password:
 *                 type: string
 *                 example: "Secur3Pass!"
 *               displayName:
 *                 type: string
 *                 example: "New User"
 *     responses:
 *       '201':
 *         description: User created and JWT issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       '400':
 *         description: Email already in use or missing fields
 *       '500':
 *         description: Registration failed
 */
router.post('/register', register);

/**
 * @openapi
 * /auth/email-login:
 *   post:
 *     summary: Login with email & password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: "test@cricketapp.com" }
 *               password: { type: string, example: "Passw0rd!" }
 *     responses:
 *       '200':
 *         description: JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       '400':
 *         description: Invalid credentials or missing fields
 *       '500':
 *         description: Authentication failed
 */
router.post('/email-login', emailLogin);

/**
 * @openapi
 * /auth/request-otp:
 *   post:
 *     summary: Send OTP to phone
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber]
 *             properties:
 *               phoneNumber: { type: string, example: "+911234567890" }
 *     responses:
 *       '200': { description: "OTP sent" }
 *       '400': { description: "Phone number required" }
 *       '500': { description: "Failed to send OTP" }
 */
router.post('/request-otp', requestOtp);

/**
 * @openapi
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phoneNumber, otp]
 *             properties:
 *               phoneNumber: { type: string, example: "+911234567890" }
 *               otp:         { type: string, example: "123456" }
 *     responses:
 *       '200':
 *         description: JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       '400':
 *         description: "Invalid or expired OTP"
 *       '500':
 *         description: "OTP verification failed"
 */
router.post('/verify-otp', verifyOtp);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login with Firebase ID token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken: { type: string }
 *     responses:
 *       '200':
 *         description: JWT token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       '400': { description: "ID token required" }
 *       '500': { description: "Authentication failed" }
 */
router.post('/login', loginWithIdToken);

module.exports = router;
