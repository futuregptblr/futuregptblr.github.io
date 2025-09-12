import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Briefcase,
  Settings,
  LogOut,
  Edit3,
  Trash2,
  Eye,
} from "lucide-react";
import { Company, Job } from "../types";
import { CreateJobModal } from "../components/company/CreateJobModal";
import { EditProfileModal } from "../components/company/EditProfileModal";
import { API_BASE_URL } from '../lib/utils';

export function CompanyDashboard() {
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "profile">(
    "overview"
  );
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const companyToken = localStorage.getItem("companyToken");
    const companyData = localStorage.getItem("company");

    if (!companyToken || !companyData) {
      navigate("/company-login");
      return;
    }

    try {
      setCompany(JSON.parse(companyData));
      fetchCompanyJobs();
    } catch (error) {
      console.error("Error parsing company data:", error);
      navigate("/company-login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchCompanyJobs = async () => {
    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${API_BASE_URL}/api/company/jobs/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    localStorage.removeItem("company");
    navigate("/company-login");
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("companyToken");
      const response = await fetch(`${API_BASE_URL}/api/company/jobs/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job.id !== jobId));
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {company.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {company.industry} • {company.location}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowEditProfile(true)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Overview", icon: Briefcase },
              { id: "jobs", label: "Jobs", icon: Briefcase },
              { id: "profile", label: "Profile", icon: Building2 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Total Jobs
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {jobs.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Active Jobs
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {jobs.filter((job) => job.isActive).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Company Size
                    </p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {company.size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recent Jobs
                  </h3>
                  <button
                    onClick={() => setShowCreateJob(true)}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Post New Job</span>
                  </button>
                </div>
              </div>
              <div className="p-6">
                {jobs.length === 0 ? (
                  <div className="text-center py-8">
                    <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No jobs posted
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Get started by posting your first job opening.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowCreateJob(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Post Job
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job) => (
                      <div
                        key={job.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {job.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {job.location} • {job.type}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {job.description.substring(0, 100)}...
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                job.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {job.isActive ? "Active" : "Inactive"}
                            </span>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Job Postings</h2>
              <button
                onClick={() => setShowCreateJob(true)}
                className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                <Plus className="h-5 w-5" />
                <span>Post New Job</span>
              </button>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No jobs posted
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by posting your first job opening.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setShowCreateJob(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Post Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-purple-600 truncate">
                                {job.title}
                              </p>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    job.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {job.isActive ? "Active" : "Inactive"}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(job.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                              {job.location} • {job.type} • {job.experience}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              {job.description.substring(0, 150)}...
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {job.skills.slice(0, 3).map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 3 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="ml-6 flex items-center space-x-2">
                            <button className="text-gray-400 hover:text-gray-600">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">
                  Company Profile
                </h3>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{company.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{company.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {company.industry}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Company Size
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{company.size}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {company.location}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {company.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Create Job Modal */}
      {showCreateJob && (
        <CreateJobModal
          onClose={() => setShowCreateJob(false)}
          onJobCreated={(newJob) => {
            setJobs([newJob, ...jobs]);
            setShowCreateJob(false);
          }}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <EditProfileModal
          company={company}
          onClose={() => setShowEditProfile(false)}
          onProfileUpdated={(updatedCompany) => {
            setCompany(updatedCompany);
            localStorage.setItem("company", JSON.stringify(updatedCompany));
            setShowEditProfile(false);
          }}
        />
      )}
    </div>
  );
}
