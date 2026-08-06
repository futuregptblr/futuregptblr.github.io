const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    status: { 
      type: String, 
      enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected'], 
      default: 'pending' 
    },
    coverLetter: { type: String, trim: true },
    resumeUrl: { type: String, required: true },
    appliedAt: { type: Date, default: Date.now },
    // Company can add notes
    companyNotes: { type: String, trim: true },
    // Interview details
    interviewDate: { type: Date },
    interviewLocation: { type: String },
    interviewType: { type: String, enum: ['phone', 'video', 'onsite'] },
    // Application metadata
    isWithdrawn: { type: Boolean, default: false },
    withdrawnAt: { type: Date }
  },
  { timestamps: true }
);

// Index for efficient queries
jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
jobApplicationSchema.index({ companyId: 1, status: 1 });
jobApplicationSchema.index({ userId: 1, status: 1 });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
