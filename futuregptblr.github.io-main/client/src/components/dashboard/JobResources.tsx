import { useState, useEffect, useMemo } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
} from "lucide-react";
import { Job } from "../../types";
import { API_BASE_URL } from "../../lib/utils";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export function JobResources() {
  const [activeTab, setActiveTab] = useState<"jobs" | "applied">("jobs");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    fetchJobs();
    fetchApplied();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Making API call to /api/company/jobs...");
      const response = await fetch(`${API_BASE_URL}/api/company/jobs`);
      console.log("API Response status:", response.status);
      console.log("API Response headers:", response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);
        console.log("Data type:", typeof data);
        console.log("Is array:", Array.isArray(data));

        if (Array.isArray(data)) {
          setJobs(data);
        } else if (data.jobs && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        } else {
          console.error("Unexpected data structure:", data);
          setError("Invalid data format received from server");
        }
      } else {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load job opportunities. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplied = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/user/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error(e);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesFilter = filterType === "all" || job.type === filterType;

    return matchesSearch && matchesFilter;
  });

  const appliedJobIdSet = useMemo(() => {
    const set = new Set<string>();
    applications.forEach((a: any) => {
      const id = typeof a.jobId === "string" ? a.jobId : a.jobId?._id;
      if (id) set.add(String(id));
    });
    return set;
  }, [applications]);

  const appliedJobs = useMemo(() => {
    // Try to use populated job objects from applications; fallback to matching in jobs list
    const list: Job[] = [] as any;
    applications.forEach((a: any) => {
      const jobObj = typeof a.jobId === "object" && a.jobId?._id ? a.jobId : jobs.find(j => j._id === a.jobId);
      if (jobObj) list.push(jobObj as Job);
    });
    return list;
  }, [applications, jobs]);

  const formatSalary = (salary?: { min?: number; max?: number; currency?: string; }) => {
    if (!salary || salary.min == null || salary.max == null) return "Salary not specified";
    const currency = salary.currency || "₹";
    return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Job Resources & Career Hub</h1>
        <p className="text-white/90">
          Access exclusive job opportunities, career tools, and professional
          networking.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "jobs", label: "Job Opportunities", count: jobs.length },
              { id: "applied", label: "Applied Jobs", count: applications.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-yellow-400 text-yellow-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "jobs" && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Loading job opportunities...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-12">
                  <div className="text-red-500 mb-4">
                    <Briefcase className="mx-auto h-12 w-12" />
                  </div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchJobs}
                    className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* No Jobs State */}
              {!loading && !error && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No jobs found
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || filterType !== "all"
                      ? "Try adjusting your search or filters."
                      : "Check back later for new opportunities."}
                  </p>
                </div>
              )}

              {/* Job Listings */}
              {!loading && !error && filteredJobs.length > 0 && (
                <div className="space-y-4">
                  {filteredJobs.map((job) => {
                    const jobId = String((job as any).id || (job as any)._id);
                    return (
                    <div
                      key={jobId}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="text-2xl">🏢</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {job.title}
                              </h3>
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                                {job.type.charAt(0).toUpperCase() +
                                  job.type.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              {job.companyName}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{job.location}</span>
                              </div>
                              {job.salary && (
                                <div className="flex items-center space-x-1">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{formatSalary(job.salary)}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{job.experience}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-3 text-sm">
                              {job.description.length > 150
                                ? `${job.description.substring(0, 150)}...`
                                : job.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills.slice(0, 5).map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 5 && (
                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  +{job.skills.length - 5} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-2">
                            {formatDate(job.createdAt)}
                          </p>
                          <Link to={`/dashboard/jobs/${jobId}`}>
                            <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                              {appliedJobIdSet.has(String(jobId)) ? "Applied" : "View details"}
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );})}
                </div>
              )}
            </div>
          )}

          {activeTab === "applied" && (
            <div className="space-y-4">
              {!applications.length && (
                <div className="text-center py-12">
                  <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Apply to jobs to see them here.</p>
                </div>
              )}
              {!!applications.length && (
                <div className="space-y-4">
                  {appliedJobs.map((job) => (
                    <div key={(job as any)._id || (job as any).id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{(job as any).title}</h3>
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Applied</span>
                            </div>
                            <p className="text-gray-600 mb-2">{(job as any).companyName}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-4 w-4" />
                                <span>{(job as any).location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{(job as any).type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Link to={`/dashboard/jobs/${(job as any)._id || (job as any).id}`}>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">View</button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
