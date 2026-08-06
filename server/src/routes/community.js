const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { listDiscussions, createDiscussion, listGroups, createGroup, communityStats, addComment } = require('../controllers/communityController');

const router = express.Router();

router.get('/discussions', listDiscussions);
router.post('/discussions', auth, createDiscussion);
router.post('/discussions/:id/comments', auth, addComment);

router.get('/groups', listGroups);
// Allow any authenticated user to create a group (was admin-only)
router.post('/groups', auth, createGroup);

router.get('/stats', communityStats);

module.exports = router;


