const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');

async function listEvents(req, res) {
  try {
    const now = new Date();
    const { scope = 'upcoming' } = req.query;
    const query = { published: true };
    if (scope === 'upcoming') {
      query.date = { $gte: now };
    } else if (scope === 'past') {
      query.date = { $lt: now };
    }
    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('listEvents error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function adminListAllEvents(req, res) {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error('adminListAllEvents error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error('getEvent error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createEvent(req, res) {
  try {
    const created = await Event.create({ ...req.body, createdBy: req.user?.sub });
    res.status(201).json(created);
  } catch (err) {
    console.error('createEvent error', err);
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function updateEvent(req, res) {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ message: 'Event not found' });
    res.json(updated);
  } catch (err) {
    console.error('updateEvent error', err);
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function deleteEvent(req, res) {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Event not found' });
    await EventRegistration.deleteMany({ eventId: deleted._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('deleteEvent error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function registerForEvent(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const registration = await EventRegistration.create({ 
      eventId: id, 
      userId, 
      userName: req.user?.name || undefined,
      userEmail: req.user?.email || undefined,
      status: 'registered' 
    });
    await Event.findByIdAndUpdate(id, { $inc: { registrationsCount: 1 } });
    res.status(201).json(registration);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: 'Already registered' });
    }
    console.error('registerForEvent error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function listMyRegistrations(req, res) {
  try {
    const userId = req.user?.sub;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const regs = await EventRegistration.find({ userId }).populate('eventId');
    res.json(regs);
  } catch (err) {
    console.error('listMyRegistrations error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function adminListRegistrations(req, res) {
  try {
    const regs = await EventRegistration.find({ eventId: req.params.id }).populate('userId', 'name email');
    res.json(regs);
  } catch (err) {
    console.error('adminListRegistrations error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  listEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  listMyRegistrations,
  adminListRegistrations,
  adminListAllEvents,
};


