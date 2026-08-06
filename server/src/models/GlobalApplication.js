const mongoose = require('mongoose');

const APPLICATION_STATUSES = ['Applied', 'Assessment', 'Interview', 'HR Round', 'Offer', 'Rejected', 'Withdrawn'];

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, required: true, trim: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, trim: true }
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
  },
  { _id: true }
);

const globalApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jobId: { type: String, required: true },
    provider: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    applyUrl: { type: String, required: true, trim: true },
    appliedDate: { type: Date, default: Date.now },
    currentStatus: { type: String, default: 'Applied', trim: true },
    notes: [noteSchema],
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: 'Applied', changedAt: new Date() }]
    },
    jobSnapshot: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

globalApplicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });
globalApplicationSchema.index({ userId: 1, currentStatus: 1 });
globalApplicationSchema.index({ userId: 1, appliedDate: -1 });

globalApplicationSchema.statics.defaultStatuses = APPLICATION_STATUSES;

module.exports = mongoose.model('GlobalApplication', globalApplicationSchema);
