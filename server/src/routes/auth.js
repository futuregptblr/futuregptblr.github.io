const express = require('express');
const { register, login } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Env-based single admin login
router.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body || {};
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin login not configured' });
    }
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token, user: { email, name: 'Admin', isPremium: true, role: 'admin' } });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


