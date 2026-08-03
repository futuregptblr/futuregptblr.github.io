const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const { listTeam, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');

const router = express.Router();

router.get('/', listTeam);
router.post('/', auth, requireAdmin, createTeamMember);
router.put('/:id', auth, requireAdmin, updateTeamMember);
router.delete('/:id', auth, requireAdmin, deleteTeamMember);

module.exports = router;


