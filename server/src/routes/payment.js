const express = require('express');
const { createOrder, verifyPayment, getPremiumStatus } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

const router = express.Router();

// Create payment order for premium membership
router.post('/create-order', auth, createOrder);

// Verify payment and update premium status
router.post('/verify-payment', auth, verifyPayment);

// Get user premium status
router.get('/premium-status/:userId', auth, getPremiumStatus);

module.exports = router;
