const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    members: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    category: { type: String, trim: true },
    avatar: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    recentActivity: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Group', groupSchema);


