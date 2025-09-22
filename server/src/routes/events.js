const express = require('express');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  listMyRegistrations,
  adminListRegistrations,
  adminListAllEvents,
} = require('../controllers/eventController');

const router = express.Router();

// Public
router.get('/', listEvents);
router.get('/:id', getEvent);

// Authenticated user
router.post('/:id/register', auth, registerForEvent);
router.get('/me/registrations', auth, listMyRegistrations);

// Admin
router.post('/', auth, requireAdmin, createEvent);
router.put('/:id', auth, requireAdmin, updateEvent);
router.delete('/:id', auth, requireAdmin, deleteEvent);
router.get('/:id/registrations', auth, requireAdmin, adminListRegistrations);
router.get('/admin/all', auth, requireAdmin, adminListAllEvents);

module.exports = router;


