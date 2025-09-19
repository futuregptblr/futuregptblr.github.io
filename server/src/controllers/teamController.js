const TeamMember = require('../models/TeamMember');

async function listTeam(req, res) {
  try {
    const members = await TeamMember.find().sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team' });
  }
}

async function createTeamMember(req, res) {
  try {
    const created = await TeamMember.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function updateTeamMember(req, res) {
  try {
    const updated = await TeamMember.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Invalid data' });
  }
}

async function deleteTeamMember(req, res) {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ message: 'Invalid id' });
  }
}

module.exports = {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};


