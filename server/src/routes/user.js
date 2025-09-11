const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name,
      phone,
      location,
      role,
      company,
      bio,
      skills,
      interests,
      resumeUrl,
      avatar,
      profileVisibility,
      showOnlineStatus,
      allowDirectMessages,
      emailNotifications,
      pushNotifications,
      eventReminders,
      jobAlerts
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (role !== undefined) user.role = role;
    if (company !== undefined) user.company = company;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (avatar !== undefined) user.avatar = avatar;
    if (profileVisibility !== undefined) user.profileVisibility = profileVisibility;
    if (showOnlineStatus !== undefined) user.showOnlineStatus = showOnlineStatus;
    if (allowDirectMessages !== undefined) user.allowDirectMessages = allowDirectMessages;
    if (emailNotifications !== undefined) user.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) user.pushNotifications = pushNotifications;
    if (eventReminders !== undefined) user.eventReminders = eventReminders;
    if (jobAlerts !== undefined) user.jobAlerts = jobAlerts;

    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's job applications
router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user.id })
      .populate('jobId', 'title companyName location type')
      .populate('companyId', 'name logo')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to a job
router.post('/apply/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user has already applied
    const existingApplication = await JobApplication.findOne({
      jobId,
      userId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Check if job has reached max applications
    if (job.applications >= job.maxApplications) {
      return res.status(400).json({ message: 'This job has reached maximum applications' });
    }

    // Create application
    const application = new JobApplication({
      jobId,
      userId: req.user.id,
      companyId: job.companyId,
      coverLetter,
      resumeUrl: resumeUrl || req.user.resumeUrl
    });

    await application.save();

    // Update job applications count
    job.applications += 1;
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Withdraw job application
router.put('/applications/:applicationId/withdraw', auth, async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (application.isWithdrawn) {
      return res.status(400).json({ message: 'Application already withdrawn' });
    }

    application.isWithdrawn = true;
    application.withdrawnAt = new Date();
    await application.save();

    // Decrease job applications count
    const job = await Job.findById(application.jobId);
    if (job && job.applications > 0) {
      job.applications -= 1;
      await job.save();
    }

    res.json(application);
  } catch (error) {
    console.error('Withdraw application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get saved jobs (if you want to implement this feature)
router.get('/saved-jobs', auth, async (req, res) => {
  try {
    // This would require a SavedJob model or adding a savedJobs field to User
    // For now, returning empty array
    res.json([]);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
