const mongoose = require('mongoose');

const globalJobCacheSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    jobs: [{ type: mongoose.Schema.Types.Mixed }],
    providerErrors: [{ type: String }],
    refreshedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

globalJobCacheSchema.index({ refreshedAt: -1 });

module.exports = mongoose.model('GlobalJobCache', globalJobCacheSchema);
