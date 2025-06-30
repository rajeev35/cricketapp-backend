// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const Otp    = require('../models/Otp');
const admin  = require('../config/firebase');

// 1️⃣ Email + Password login

exports.register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    // Prevent duplicates
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ email, password: hashed, displayName });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn:'7d' });
    return res.status(201).json({ token, displayName: user.displayName,});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Registration failed' });
  }
};
exports.emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, displayName: user.displayName,});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// 2️⃣ Request an OTP for a phone number
exports.requestOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ error: 'Phone number required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

    await Otp.findOneAndUpdate(
      { phoneNumber },
      { code, expiresAt },
      { upsert: true }
    );

    console.log(`OTP for ${phoneNumber}: ${code}`); 
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// 3️⃣ Verify the OTP and issue JWT
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp)
      return res.status(400).json({ error: 'Phone number and OTP required' });

    const record = await Otp.findOne({ phoneNumber });
    if (!record || record.code !== otp || record.expiresAt < new Date())
      return res.status(400).json({ error: 'Invalid or expired OTP' });

    await Otp.deleteOne({ phoneNumber });

    let user = await User.findOne({ phoneNumber });
    if (!user) {
      user = await User.create({ phoneNumber, displayName: phoneNumber });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, displayName: user.displayName,});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

// 4️⃣ Existing Firebase-ID-Token login
exports.loginWithIdToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ error: 'ID token required' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, phone_number, name, email } = decoded;
    const phoneNumber = phone_number || email;

    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = await User.create({ firebaseUid: uid, phoneNumber, email, displayName: name });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
