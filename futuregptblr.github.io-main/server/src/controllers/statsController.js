const User = require('../models/User');
const Job = require('../models/Job');
const Event = require('../models/Event');
const TeamMember = require('../models/TeamMember');
const Waitlist = require('../models/Waitlist');

async function getPublicStats(req, res) {
  try {
    const [userCount, premiumCount, jobCount, upcomingEvents, teamCount, waitlistCount] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isPremium: true }),
      Job.countDocuments({ isActive: true }),
      Event.countDocuments({ date: { $gte: new Date() }, published: true }),
      TeamMember.countDocuments({ isActive: true }),
      Waitlist.countDocuments()
    ]);

    res.json({
      users: userCount,
      premiumUsers: premiumCount,
      jobs: jobCount,
      upcomingEvents,
      teamMembers: teamCount,
      waitlist: waitlistCount,
    });
  } catch (err) {
    console.error('getPublicStats error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getPublicStats };

async function getRecentActivity(req, res) {
  try {
    const [events, jobs, discussions, users] = await Promise.all([
      Event.find({}).sort({ createdAt: -1 }).limit(5),
      Job.find({}).sort({ createdAt: -1 }).limit(5),
      require('../models/Discussion').find({}).sort({ createdAt: -1 }).limit(5),
      User.find({}).sort({ createdAt: -1 }).limit(5),
    ]);

    const items = [
      ...events.map(e => ({
        type: 'event',
        title: e.title,
        description: `${e.title} event is ${e.published ? 'published' : 'draft'}`,
        createdAt: e.createdAt,
        meta: { id: String(e._id), date: e.date, location: e.location }
      })),
      ...jobs.map(j => ({
        type: 'job',
        title: j.title,
        description: `New job posted: ${j.title} at ${j.companyName}`,
        createdAt: j.createdAt,
        meta: { id: String(j._id), company: j.companyName, location: j.location }
      })),
      ...discussions.map(d => ({
        type: 'discussion',
        title: d.title,
        description: `New discussion on ${d.title} by ${d.authorName || 'Member'}`,
        createdAt: d.createdAt,
        meta: { id: String(d._id) }
      })),
      ...users.map(u => ({
        type: 'user',
        title: u.name || u.email,
        description: `${u.name || u.email} joined FutureGPT` ,
        createdAt: u.createdAt,
        meta: { id: String(u._id), email: u.email }
      })),
    ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

    res.json(items);
  } catch (err) {
    console.error('getRecentActivity error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports.getRecentActivity = getRecentActivity;


