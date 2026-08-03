const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  getApplications,
  applyToJob,
  withdrawApplication,
  getSavedJobs
} = require('../controllers/userController');

// Get user profile
router.get('/profile', auth, getProfile);

// Update user profile
router.put('/profile', auth, updateProfile);

// Get user's job applications
router.get('/applications', auth, getApplications);

// Apply to a job
router.post('/apply/:jobId', auth, applyToJob);

// Withdraw job application
router.put('/applications/:applicationId/withdraw', auth, withdrawApplication);

// Get saved jobs (if you want to implement this feature)
router.get('/saved-jobs', auth, getSavedJobs);

module.exports = router;
