// src/models/Otp.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OtpSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true },
  code:        { type: String, required: true },
  expiresAt:   { type: Date,   required: true },
});

module.exports = mongoose.model('Otp', OtpSchema);
