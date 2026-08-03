const TeamMember = require("../models/TeamMember");

async function listTeam(req, res) {
  try {
    const members = await TeamMember.find()
      .sort({
        order: 1,
        createdAt: -1,
      });

    return res.status(200).json(members);
  } catch (err) {
    console.error("listTeam error:", err);

    return res.status(500).json({
      message: "Failed to fetch team members",
    });
  }
}

async function createTeamMember(req, res) {
  try {
    const created = await TeamMember.create(req.body);

    return res.status(201).json(created);
  } catch (err) {
    console.error("createTeamMember error:", err);

    return res.status(400).json({
      message: "Invalid data",
    });
  }
}

async function updateTeamMember(req, res) {
  try {
    const updated = await TeamMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    return res.json(updated);
  } catch (err) {
    console.error("updateTeamMember error:", err);

    return res.status(400).json({
      message: "Invalid data",
    });
  }
}

async function deleteTeamMember(req, res) {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: "Team member not found",
      });
    }

    return res.json({
      success: true,
      message: "Team member deleted successfully",
    });
  } catch (err) {
    console.error("deleteTeamMember error:", err);

    return res.status(400).json({
      message: "Invalid ID",
    });
  }
}

module.exports = {
  listTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};