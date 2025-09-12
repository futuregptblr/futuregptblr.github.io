const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['waiting', 'notified', 'converted'],
    default: 'waiting'
  },
  notifiedAt: {
    type: Date
  },
  convertedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Waitlist', waitlistSchema);
