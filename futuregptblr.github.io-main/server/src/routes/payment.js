const express = require('express');
const { createPhonePePayment, verifyPhonePePayment, getPremiumStatus } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create PhonePe payment for premium membership
router.post('/create-payment', auth, createPhonePePayment);

// Verify PhonePe payment and update premium status
router.post('/verify-payment', auth, verifyPhonePePayment);

// Get user premium status
router.get('/premium-status/:userId', auth, getPremiumStatus);

module.exports = router;
