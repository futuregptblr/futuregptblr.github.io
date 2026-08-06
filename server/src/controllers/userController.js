const User = require('../models/User');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');

async function getProfile(req, res) {
  try {
    const user = await User.findById(req.user.sub).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateProfile(req, res) {
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
      experience,
      avatar,
      profileVisibility,
      showOnlineStatus,
      allowDirectMessages,
      emailNotifications,
      pushNotifications,
      eventReminders,
      jobAlerts
    } = req.body;

    const user = await User.findById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (role !== undefined) user.role = role;
    if (company !== undefined) user.company = company;
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (interests !== undefined) user.interests = interests;
    if (resumeUrl !== undefined) user.resumeUrl = resumeUrl;
    if (experience !== undefined) user.experience = experience;
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
}

async function getApplications(req, res) {
  try {
    const applications = await JobApplication.find({ userId: req.user.sub })
      .populate('jobId', 'title companyName location type')
      .populate('companyId', 'name logo')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function applyToJob(req, res) {
  try {
    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    const existingApplication = await JobApplication.findOne({ jobId, userId: req.user.sub });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    if (job.applications >= job.maxApplications) {
      return res.status(400).json({ message: 'This job has reached maximum applications' });
    }

    let finalResumeUrl = resumeUrl;
    if (!finalResumeUrl) {
      const userDoc = await User.findById(req.user.sub).select('resumeUrl');
      finalResumeUrl = userDoc?.resumeUrl;
    }

    const application = new JobApplication({
      jobId,
      userId: req.user.sub,
      companyId: job.companyId,
      coverLetter,
      resumeUrl: finalResumeUrl
    });

    await application.save();

    job.applications += 1;
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function withdrawApplication(req, res) {
  try {
    const { applicationId } = req.params;

    const application = await JobApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.userId.toString() !== req.user.sub) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (application.isWithdrawn) {
      return res.status(400).json({ message: 'Application already withdrawn' });
    }

    application.isWithdrawn = true;
    application.withdrawnAt = new Date();
    await application.save();

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
}

async function getSavedJobs(_req, res) {
  try {
    res.json([]);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getApplications,
  applyToJob,
  withdrawApplication,
  getSavedJobs
};
