const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const companyAuth = require('../middleware/companyAuth');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

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

// Get specific job with full details
router.get('/jobs/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    
    const job = await Job.findById(jobId)
      .populate('companyId', 'name description website logo industry size location isVerified');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get applications for a specific job
router.get('/jobs/:jobId/applications', companyAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    
    // Verify the job belongs to the company
    const job = await Job.findById(jobId);
    if (!job || job.companyId.toString() !== req.company.id) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const applications = await JobApplication.find({ jobId })
      .populate('userId', 'name email phone location role company')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all applications for company
router.get('/applications', companyAuth, async (req, res) => {
  try {
    const applications = await JobApplication.find({ companyId: req.company.id })
      .populate('jobId', 'title location type')
      .populate('userId', 'name email phone location role company')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get company applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update application status
router.put('/applications/:applicationId/status', companyAuth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, companyNotes, interviewDate, interviewLocation, interviewType } = req.body;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Verify the application belongs to the company
    if (application.companyId.toString() !== req.company.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update fields
    if (status) application.status = status;
    if (companyNotes !== undefined) application.companyNotes = companyNotes;
    if (interviewDate !== undefined) application.interviewDate = interviewDate;
    if (interviewLocation !== undefined) application.interviewLocation = interviewLocation;
    if (interviewType !== undefined) application.interviewType = interviewType;

    await application.save();
    res.json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get application statistics for company
router.get('/applications/stats', companyAuth, async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      { $match: { companyId: req.company.id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await JobApplication.countDocuments({ companyId: req.company.id });
    const pendingApplications = await JobApplication.countDocuments({ 
      companyId: req.company.id, 
      status: 'pending' 
    });

    res.json({
      total: totalApplications,
      pending: pendingApplications,
      byStatus: stats
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
