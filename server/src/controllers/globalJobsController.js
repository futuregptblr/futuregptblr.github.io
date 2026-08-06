const jobsService = require('../services/globalJobs/jobs.service');
const GlobalSavedJob = require('../models/GlobalSavedJob');
const GlobalApplication = require('../models/GlobalApplication');
const GlobalApplicationStatus = require('../models/GlobalApplicationStatus');
const { isValidDate, isValidObjectId, sanitizeNote } = require('../services/globalJobs/validation');

function serializeList(jobs, limit, page) {
  const safeLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const start = (safePage - 1) * safeLimit;

  return {
    jobs: jobs.slice(start, start + safeLimit),
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: jobs.length,
      pages: Math.ceil(jobs.length / safeLimit)
    }
  };
}

async function getJobs(req, res) {
  try {
    const result = await jobsService.getJobs(req.query);
    res.json({
      ...serializeList(result.jobs, req.query.limit, req.query.page),
      cache: result.cache,
      refreshedAt: result.refreshedAt,
      providerErrors: result.errors
    });
  } catch (error) {
    console.error('Global jobs fetch error:', error);
    res.status(503).json({ message: 'Global jobs are temporarily unavailable' });
  }
}

async function getJobDetails(req, res) {
  try {
    const job = await jobsService.getJobById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Global job not found' });
    res.json(job);
  } catch (error) {
    console.error('Global job detail error:', error);
    res.status(503).json({ message: 'Global job details are temporarily unavailable' });
  }
}

async function saveJob(req, res) {
  try {
    const job = await jobsService.getJobById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Global job not found' });

    const savedJob = await GlobalSavedJob.findOneAndUpdate(
      { userId: req.user.sub, jobId: job.id },
      {
        userId: req.user.sub,
        jobId: job.id,
        provider: job.provider,
        company: job.company,
        title: job.title,
        location: job.location,
        applyUrl: job.applyUrl,
        jobSnapshot: job
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Global save job error:', error);
    res.status(500).json({ message: 'Unable to save global job' });
  }
}

async function deleteSavedJob(req, res) {
  try {
    const deleted = await GlobalSavedJob.findOneAndDelete({ userId: req.user.sub, jobId: req.params.jobId });
    if (!deleted) return res.status(404).json({ message: 'Saved global job not found' });
    res.json({ message: 'Saved global job removed' });
  } catch (error) {
    console.error('Global saved job delete error:', error);
    res.status(500).json({ message: 'Unable to remove saved global job' });
  }
}

async function getSavedJobs(req, res) {
  try {
    const savedJobs = await GlobalSavedJob.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    res.json(savedJobs);
  } catch (error) {
    console.error('Global saved jobs error:', error);
    res.status(500).json({ message: 'Unable to fetch saved global jobs' });
  }
}

async function confirmApplication(req, res) {
  try {
    if (!isValidDate(req.body?.appliedDate)) {
      return res.status(400).json({ message: 'Applied date is invalid' });
    }

    const job = await jobsService.getJobById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Global job not found' });

    const application = await GlobalApplication.findOneAndUpdate(
      { userId: req.user.sub, jobId: job.id },
      {
        $setOnInsert: {
          userId: req.user.sub,
          jobId: job.id,
          provider: job.provider,
          company: job.company,
          title: job.title,
          applyUrl: job.applyUrl,
          appliedDate: req.body?.appliedDate ? new Date(req.body.appliedDate) : new Date(),
          currentStatus: 'Applied',
          jobSnapshot: job
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(application);
  } catch (error) {
    console.error('Global confirm application error:', error);
    res.status(500).json({ message: 'Unable to confirm global application' });
  }
}

async function getApplications(req, res) {
  try {
    const applications = await GlobalApplication.find({ userId: req.user.sub }).sort({ appliedDate: -1 }).lean();
    res.json(applications);
  } catch (error) {
    console.error('Global applications error:', error);
    res.status(500).json({ message: 'Unable to fetch global applications' });
  }
}

async function updateStatus(req, res) {
  try {
    if (!isValidObjectId(req.params.applicationId)) {
      return res.status(400).json({ message: 'Invalid application id' });
    }

    const { status } = req.body || {};
    const note = sanitizeNote(req.body?.note);
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ message: 'Status is required' });
    }

    const statusExists = GlobalApplication.defaultStatuses.includes(status)
      || await GlobalApplicationStatus.exists({ name: status, isActive: true });

    if (!statusExists) {
      return res.status(400).json({ message: 'Invalid application status' });
    }

    const application = await GlobalApplication.findOne({ _id: req.params.applicationId, userId: req.user.sub });
    if (!application) return res.status(404).json({ message: 'Global application not found' });

    application.currentStatus = status;
    application.statusHistory.push({ status, note });
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Global status update error:', error);
    res.status(500).json({ message: 'Unable to update global application status' });
  }
}

async function updateNotes(req, res) {
  try {
    if (!isValidObjectId(req.params.applicationId)) {
      return res.status(400).json({ message: 'Invalid application id' });
    }

    const note = sanitizeNote(req.body?.note);
    if (!note) {
      return res.status(400).json({ message: 'Note is required' });
    }

    const application = await GlobalApplication.findOne({ _id: req.params.applicationId, userId: req.user.sub });
    if (!application) return res.status(404).json({ message: 'Global application not found' });

    application.notes.push({ body: note });
    await application.save();

    res.json(application);
  } catch (error) {
    console.error('Global notes update error:', error);
    res.status(500).json({ message: 'Unable to update global application notes' });
  }
}

async function getStatuses(_req, res) {
  try {
    const customStatuses = await GlobalApplicationStatus.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.json([...GlobalApplication.defaultStatuses, ...customStatuses.map((status) => status.name)]);
  } catch (error) {
    console.error('Global statuses error:', error);
    res.status(500).json({ message: 'Unable to fetch global application statuses' });
  }
}

module.exports = {
  confirmApplication,
  deleteSavedJob,
  getApplications,
  getJobDetails,
  getJobs,
  getSavedJobs,
  getStatuses,
  saveJob,
  updateNotes,
  updateStatus
};
