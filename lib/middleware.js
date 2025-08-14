const jwt = require('jsonwebtoken');
const User = require('./userModel');

const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireVerified = (req, res, next) => {
  if (!req.user.verified) return res.status(403).json({ message: 'Email not verified' });
  next();
};

module.exports = { requireAuth, requireVerified };
