const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { signUpload, signResumeUpload, uploadResume } = require('../controllers/cloudinaryController');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/sign', auth, requireAdmin, signUpload);
router.post('/sign-resume', auth, signResumeUpload);
// Server-side upload endpoint (no signature on client)
router.post('/upload-resume', auth, upload.single('file'), uploadResume);

module.exports = router;


