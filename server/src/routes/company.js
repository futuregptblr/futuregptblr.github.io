const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const companyAuth = require('../middleware/companyAuth');

// Public routes
router.post('/register', companyController.register);
router.post('/login', companyController.login);
router.get('/jobs', companyController.getAllJobs);

// Protected routes
router.get('/profile', companyAuth, companyController.getProfile);
router.put('/profile', companyAuth, companyController.updateProfile);
router.post('/jobs', companyAuth, companyController.createJob);
router.get('/jobs/company', companyAuth, companyController.getCompanyJobs);
router.put('/jobs/:jobId', companyAuth, companyController.updateJob);
router.delete('/jobs/:jobId', companyAuth, companyController.deleteJob);

module.exports = router;
