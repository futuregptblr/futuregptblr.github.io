import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Building2, Filter, Search, ExternalLink } from 'lucide-react';
import { Job, User } from '../types';
import { JobApplicationModal } from '../components/dashboard/JobApplicationModal';
import { API_BASE_URL } from '../lib/utils';

export function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userApplications, setUserApplications] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchUserProfile();
    fetchUserApplications();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/company/jobs`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/user/applications`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const applications = await response.json();
          const jobIds = applications
            .map((app: any) => {
              const jid = app?.jobId;
              if (!jid) return undefined;
              // jobId can be a string/ObjectId or a populated object
              return typeof jid === 'string' ? jid : (jid?._id || jid?.id);
            })
            .filter(Boolean)
            .map((id: any) => String(id));
          setUserApplications(jobIds as string[]);
        }
      }
    } catch (error) {
      console.error('Error fetching user applications:', error);
    }
  };

  const handleApplyToJob = (job: Job) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login or show login modal
      window.location.href = '/login';
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleJobApplication = async (applicationData: { coverLetter: string; resumeUrl: string }) => {
    try {
      const token = localStorage.getItem('token');
      if (!selectedJob) return;

      const selectedJobId = (selectedJob as any).id || (selectedJob as any)._id;
      const response = await fetch(`${API_BASE_URL}/api/user/apply/${selectedJobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        // Update local state
        setUserApplications(prev => [...prev, String(selectedJobId)]);
        // Update job applications count
        setJobs(prev => prev.map(job => 
          ((job as any).id || (job as any)._id) === selectedJobId 
            ? { ...job, applications: (job.applications || 0) + 1 }
            : job
        ));
        setShowApplicationModal(false);
        setSelectedJob(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      // You could show an error message here
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const uniqueLocations = Array.from(new Set(jobs.map(job => job.location))).sort();
  const jobTypes = ['all', 'full-time', 'part-time', 'contract', 'internship'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Find Your Next Opportunity
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover exciting job opportunities from top companies in the FutureGPT community
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Job Type Filter */}
            <div className="flex gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {jobTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>

              {/* Location Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
          </h2>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => {
              const jobId = String((job as any).id || (job as any)._id);
              return (
              <div key={jobId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-purple-600 cursor-pointer">
                          <a href={`/jobs/${jobId}`} className="hover:underline">
                            {job.title}
                          </a>
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4 mr-1" />
                          <span className="font-medium">{job.companyName}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          job.type === 'full-time' ? 'bg-blue-100 text-blue-800' :
                          job.type === 'part-time' ? 'bg-green-100 text-green-800' :
                          job.type === 'contract' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {job.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{job.experience}</span>
                      </div>
                      {job.salary && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          <span>
                            ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 text-gray-700 line-clamp-3">
                      {job.description}
                    </p>

                    {job.skills.length > 0 && (
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.skills.length > 6 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                              +{job.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {job.benefits.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.slice(0, 4).map((benefit, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                            >
                              {benefit}
                            </span>
                          ))}
                          {job.benefits.length > 4 && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                              +{job.benefits.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col space-y-2">
                    {userApplications.includes(jobId) ? (
                      <div className="text-center">
                        <div className="px-6 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
                          ✓ Applied
                        </div>
                        <a 
                          href={`/jobs/${jobId}`}
                          className="block mt-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          View Details
                        </a>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleApplyToJob(job)}
                          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                          Apply Now
                        </button>
                        <a 
                          href={`/jobs/${jobId}`}
                          className="px-6 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium text-center"
                        >
                          View Details
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );})}
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      {showApplicationModal && selectedJob && user && (
        <JobApplicationModal
          isOpen={showApplicationModal}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          user={user}
          onApply={handleJobApplication}
        />
      )}
    </div>
  );
}
