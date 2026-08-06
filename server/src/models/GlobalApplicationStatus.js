const mongoose = require('mongoose');

const globalApplicationStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('GlobalApplicationStatus', globalApplicationStatusSchema);
