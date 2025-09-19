const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { signUpload } = require('../controllers/cloudinaryController');

const router = express.Router();

router.post('/sign', auth, requireAdmin, signUpload);

module.exports = router;


