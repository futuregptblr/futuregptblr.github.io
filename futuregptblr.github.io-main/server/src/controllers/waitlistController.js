const Waitlist = require('../models/Waitlist');

async function joinWaitlist(req, res) {
  try {
    const { name, email, mobile, location } = req.body;

    // Validate required fields
    if (!name || !email || !mobile || !location) {
      return res.status(400).json({ 
        message: 'All fields are required' 
      });
    }

    // Check if email already exists
    const existingEntry = await Waitlist.findOne({ email });
    if (existingEntry) {
      return res.status(400).json({ 
        message: 'Email already registered for waitlist' 
      });
    }

    // Create new waitlist entry
    const waitlistEntry = new Waitlist({
      name,
      email,
      mobile,
      location
    });

    await waitlistEntry.save();

    res.status(201).json({
      message: 'Successfully joined waitlist',
      data: {
        id: waitlistEntry._id,
        name: waitlistEntry.name,
        email: waitlistEntry.email,
        joinedAt: waitlistEntry.joinedAt
      }
    });
  } catch (error) {
    console.error('Join waitlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getWaitlistStats(req, res) {
  try {
    const totalCount = await Waitlist.countDocuments();
    const waitingCount = await Waitlist.countDocuments({ status: 'waiting' });
    const notifiedCount = await Waitlist.countDocuments({ status: 'notified' });
    const convertedCount = await Waitlist.countDocuments({ status: 'converted' });

    res.json({
      total: totalCount,
      waiting: waitingCount,
      notified: notifiedCount,
      converted: convertedCount
    });
  } catch (error) {
    console.error('Get waitlist stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

async function getAllWaitlistEntries(req, res) {
  try {
    const entries = await Waitlist.find()
      .sort({ joinedAt: -1 })
      .select('-__v');

    res.json(entries);
  } catch (error) {
    console.error('Get all waitlist entries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  joinWaitlist,
  getWaitlistStats,
  getAllWaitlistEntries
};
