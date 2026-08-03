const Discussion = require('../models/Discussion');
const Group = require('../models/Group');
const User = require('../models/User');

async function listDiscussions(req, res) {
  try {
    const items = await Discussion.find().sort({ isPinned: -1, createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    console.error('listDiscussions error', err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createDiscussion(req, res) {
  try {
    const created = await Discussion.create({ ...req.body, createdBy: req.user?.sub, authorName: req.user?.name });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function listGroups(req, res) {
  try {
    const items = await Group.find().sort({ createdAt: -1 }).limit(100);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

async function createGroup(req, res) {
  try {
    const created = await Group.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function addComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content is required' });
    const comment = { content: content.trim(), authorName: req.user?.name, authorId: req.user?.sub };
    const updated = await Discussion.findByIdAndUpdate(
      id,
      { $push: { comments: comment }, $inc: { replies: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Discussion not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function communityStats(req, res) {
  try {
    const [members, groups, discussions] = await Promise.all([
      User.countDocuments(),
      Group.countDocuments(),
      Discussion.countDocuments(),
    ]);
    res.json({ members, groups, discussions });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { listDiscussions, createDiscussion, listGroups, createGroup, communityStats, addComment };


