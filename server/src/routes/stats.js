const express = require('express');
const { getPublicStats, getRecentActivity } = require('../controllers/statsController');
const router = express.Router();

router.get('/', getPublicStats);
router.get('/recent', getRecentActivity);

module.exports = router;


