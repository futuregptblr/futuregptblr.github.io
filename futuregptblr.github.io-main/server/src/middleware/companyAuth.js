const jwt = require('jsonwebtoken');
const Company = require('../models/Company');

const companyAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const company = await Company.findById(decoded.companyId).select('-password');
    
    if (!company) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.companyId = decoded.companyId;
    req.company = company;
    next();
  } catch (error) {
    console.error('Company auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = companyAuth;
