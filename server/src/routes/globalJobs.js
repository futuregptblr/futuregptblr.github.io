const express = require('express');
const auth = require('../middleware/auth');
const controller = require('../controllers/globalJobsController');

const router = express.Router();

router.get('/', controller.getJobs);
router.get('/saved', auth, controller.getSavedJobs);
router.get('/applications', auth, controller.getApplications);
router.get('/applications/statuses', auth, controller.getStatuses);
router.patch('/applications/:applicationId/status', auth, controller.updateStatus);
router.patch('/applications/:applicationId/notes', auth, controller.updateNotes);
router.get('/:jobId', controller.getJobDetails);
router.post('/:jobId/save', auth, controller.saveJob);
router.delete('/:jobId/save', auth, controller.deleteSavedJob);
router.post('/:jobId/applications', auth, controller.confirmApplication);

module.exports = router;
