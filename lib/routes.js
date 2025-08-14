const express = require('express');
const router = express.Router();
const User = require('./userModel');
const { hashPassword, comparePassword, generateToken, generateOTP, verifyToken } = require('./utils');
const { sendVerificationEmail, sendResetOTPEmail } = require('./email');

module.exports = (config, middleware) => {

  // Signup
  router.post('/signup', async (req, res) => {
    try {
      const { required = [], optional = [] } = config.signupFields || {};
      const userData = {};

      for (let field of required) {
        if (!req.body[field]) return res.status(400).json({ message: `${field} is required` });
        userData[field] = req.body[field];
      }
      for (let field of optional) {
        if (req.body[field]) userData[field] = req.body[field];
      }

      const exist = await User.findOne({ email: userData.email });
      if (exist) return res.status(400).json({ message: 'Email already exists' });

      userData.password = await hashPassword(userData.password);
      const user = await User.create(userData);

      const token = generateToken({ id: user._id }, process.env.VERIFICATION_TOKEN_EXPIRY);
      await sendVerificationEmail(user.email, token);

      res.json({ message: 'Signup successful, verify your email' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });

router.get('/verify-email', async (req, res) => {
    const token = req.query.token;       // read token from query
    if (!token) return res.status(400).json({ message: 'Token missing' });

    try {
      const decoded = verifyToken(token);  // use verifyToken from utils.js
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).json({ message: 'Invalid token' });

      user.verified = true;
      await user.save();
      res.json({ message: 'Email verified successfully' });
    } catch (err) {
      res.status(400).json({ message: 'Invalid or expired token', error: err.message });
    }
  });


  // Login
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const match = await comparePassword(password, user.password);
      if (!match) return res.status(400).json({ message: 'Incorrect password' });
      if (!user.verified) return res.status(403).json({ message: 'Email not verified' });

      const token = generateToken({ id: user._id }, process.env.AUTH_TOKEN_EXPIRY);
      res.json({ token });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Update Profile
  router.put('/update-profile', middleware.requireAuth, middleware.requireVerified, async (req, res) => {
    try {
      const user = req.user;
      const allowedFields = config.allowProfileUpdate || [];
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) user[field] = req.body[field];
      });
      await user.save();
      res.json({ message: 'Profile updated successfully', user });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Request Reset OTP
  router.post('/request-reset', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: 'Email required' });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });

      const otp = generateOTP();
      user.resetOTP = await hashPassword(otp);
      user.resetOTPExpiry = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendResetOTPEmail(user.email, otp);
      res.json({ message: 'OTP sent to your email' });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Reset Password with OTP
  router.post('/reset-password', async (req, res) => {
    try {
      const { email, otp, newPassword } = req.body;
      if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Email, OTP, and new password required' });

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: 'User not found' });
      if (!user.resetOTP || !user.resetOTPExpiry || user.resetOTPExpiry < new Date())
        return res.status(400).json({ message: 'OTP expired or not found' });

      const validOTP = await comparePassword(otp, user.resetOTP);
      if (!validOTP) return res.status(400).json({ message: 'Invalid OTP' });

      user.password = await hashPassword(newPassword);
      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;
      await user.save();

      res.json({ message: 'Password reset successfully' });
    } catch {
      res.status(500).json({ message: 'Server error' });
    }
  });
  // get user
  router.get('/me', middleware.requireAuth, async (req, res) => {
    res.json({ user: req.user });
  });

  return router;
};
