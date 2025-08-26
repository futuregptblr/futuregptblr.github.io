const express = require('express');
const { getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

router.get('/profile', getProfile);

module.exports = router;
