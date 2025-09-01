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
    applications: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
