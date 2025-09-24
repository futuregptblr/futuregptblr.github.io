const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  const payload = { sub: user._id, email: user.email, name: user.name };
  const secret = process.env.JWT_SECRET;
  const options = { expiresIn: '7d' };
  return jwt.sign(payload, secret, options);
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Password policy: min 8 chars, upper, lower, digit, special
    const passwordPolicy = {
      minLength: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };
    if (!passwordPolicy.minLength || !passwordPolicy.upper || !passwordPolicy.lower || !passwordPolicy.digit || !passwordPolicy.special) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and include upper, lower, number, and special character'
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashedPassword = await User.hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = createToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, isPremium: user.isPremium } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = createToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, isPremium: user.isPremium } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  register,
  login
};
