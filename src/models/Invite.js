const mongoose = require('mongoose');
const { Schema } = mongoose;

const InviteSchema = new Schema({
  match:    { type: Schema.Types.ObjectId, ref: 'Match', required: true },
  inviter:  { type: Schema.Types.ObjectId, ref: 'User',  required: true },
  invitee:  { type: Schema.Types.ObjectId, ref: 'User',  required: true },
  status:   { type: String, enum: ['pending','accepted','declined'], default: 'pending' },
  createdAt:{ type: Date,   default: Date.now }
});

module.exports = mongoose.model('Invite', InviteSchema);
