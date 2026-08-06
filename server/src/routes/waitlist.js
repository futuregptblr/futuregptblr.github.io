const express = require('express');
const router = express.Router();
const { joinWaitlist, getWaitlistStats, getAllWaitlistEntries } = require('../controllers/waitlistController');

// Join waitlist (public endpoint)
router.post('/join', joinWaitlist);

// Get waitlist stats (public endpoint for display)
router.get('/stats', getWaitlistStats);

// Get all waitlist entries (admin only - you might want to add auth middleware)
router.get('/entries', getAllWaitlistEntries);

module.exports = router;
