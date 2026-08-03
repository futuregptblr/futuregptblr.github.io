const mongoose = require('mongoose');

const globalSavedJobSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: String, required: true },
    provider: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    applyUrl: { type: String, required: true, trim: true },
    jobSnapshot: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

globalSavedJobSchema.index({ userId: 1, jobId: 1 }, { unique: true });
globalSavedJobSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('GlobalSavedJob', globalSavedJobSchema);
