const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firebaseUid: { type: String, unique: true, sparse: true, default: undefined},
  email:       { type: String, unique: true, sparse: true },
  password:    { type: String },               // hashed via bcrypt
  phoneNumber: { type: String, unique: true, sparse: true },
  displayName: { type: String },
  createdAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);