const Company = require('../models/Company');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');

// Company registration
exports.register = async (req, res) => {
  try {
    const { name, email, password, description, website, industry, size, location } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this email already exists' });
    }

    // Hash password
    const hashedPassword = await Company.hashPassword(password);

    // Create new company
    const company = new Company({
      name,
      email,
      password: hashedPassword,
      description,
      website,
      industry,
      size,
      location
    });

    await company.save();

    // Generate JWT token
    const token = jwt.sign(
      { companyId: company._id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const companyResponse = company.toObject();
    delete companyResponse.password;

    res.status(201).json({
      message: 'Company registered successfully',
      token,
      company: companyResponse
    });
  } catch (error) {
    console.error('Company registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Company login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await company.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { companyId: company._id, email: company.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove password from response
    const companyResponse = company.toObject();
    delete companyResponse.password;

    res.json({
      message: 'Login successful',
      token,
      company: companyResponse
    });
  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get company profile
exports.getProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.companyId).select('-password');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Get company profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update company profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, description, website, industry, size, location } = req.body;
    
    const company = await Company.findByIdAndUpdate(
      req.companyId,
      { name, description, website, industry, size, location },
      { new: true, runValidators: true }
    ).select('-password');

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      company
    });
  } catch (error) {
    console.error('Update company profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create job
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      type,
      salary,
      experience,
      skills,
      benefits
    } = req.body;

    const company = await Company.findById(req.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const job = new Job({
      companyId: req.companyId,
      companyName: company.name,
      title,
      description,
      requirements,
      location,
      type,
      salary,
      experience,
      skills,
      benefits
    });

    await job.save();

    res.status(201).json({
      message: 'Job created successfully',
      job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get company jobs
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ companyId: req.companyId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Get company jobs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update job
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findOneAndUpdate(
      { _id: jobId, companyId: req.companyId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete job
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOneAndDelete({ _id: jobId, companyId: req.companyId });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all jobs (public)
exports.getAllJobs = async (req, res) => {
  try {
    console.log('Fetching all jobs...');
    const jobs = await Job.find()
      .populate('companyId', 'name logo industry')
      .sort({ createdAt: -1 });
    
    console.log('Raw jobs from database:', jobs);
    
    // Transform the data to match the frontend expectations
    const transformedJobs = jobs.map(job => ({
      id: job._id,
      companyId: job.companyId._id || job.companyId,
      companyName: job.companyName,
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      type: job.type,
      salary: job.salary,
      experience: job.experience,
      skills: job.skills,
      benefits: job.benefits,
      isActive: job.isActive,
      createdAt: job.createdAt,
      applications: job.applications
    }));
    
    console.log('Transformed jobs:', transformedJobs);
    res.json(transformedJobs);
  } catch (error) {
    console.error('Get all jobs error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
