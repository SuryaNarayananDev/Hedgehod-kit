const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  gender: String,
  verified: { type: Boolean, default: false },
  resetOTP: String,
  resetOTPExpiry: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
