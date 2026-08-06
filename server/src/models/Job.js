const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    location: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['full-time', 'part-time', 'contract', 'internship'], 
      required: true 
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' }
    },
    experience: { type: String, required: true },
    skills: [{ type: String }],
    benefits: [{ type: String }],
    isActive: { type: Boolean, default: true },
    applications: { type: Number, default: 0 },
    // Additional fields
    department: { type: String, trim: true },
    remotePolicy: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'onsite' },
    applicationDeadline: { type: Date },
    startDate: { type: Date },
    contractDuration: { type: String }, // For contract roles
    visaSponsorship: { type: Boolean, default: false },
    relocationAssistance: { type: Boolean, default: false },
    // Application settings
    allowCoverLetter: { type: Boolean, default: true },
    requireResume: { type: Boolean, default: true },
    maxApplications: { type: Number, default: 1000 } // Limit total applications
  },
  { timestamps: true }
);

// Index for efficient queries
jobSchema.index({ companyId: 1, isActive: 1 });
jobSchema.index({ location: 1, type: 1, isActive: 1 });
jobSchema.index({ skills: 1, isActive: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
