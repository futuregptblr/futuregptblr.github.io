import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Search,
  ExternalLink,
} from "lucide-react";
import { Job } from "../../types";
import { API_BASE_URL } from "../../lib/utils";
import { Link } from "react-router-dom";

export function JobResources() {
  const [activeTab, setActiveTab] = useState<"jobs" | "resources" | "network">(
    "jobs"
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchJobs();
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
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
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

  const resources = [
    {
      title: "Resume Builder",
      description: "Create professional resumes with AI-powered suggestions",
      icon: "📝",
      category: "Career Tools",
    },
    {
      title: "Interview Prep",
      description: "Practice with AI mock interviews and get feedback",
      icon: "🎯",
      category: "Career Tools",
    },
    {
      title: "Salary Negotiation Guide",
      description: "Learn strategies for negotiating better compensation",
      icon: "💰",
      category: "Career Tools",
    },
    {
      title: "Networking Events",
      description: "Connect with industry professionals at exclusive events",
      icon: "🤝",
      category: "Networking",
    },
    {
      title: "Mentorship Program",
      description: "Get paired with experienced professionals in your field",
      icon: "👨‍🏫",
      category: "Networking",
    },
    {
      title: "Skill Assessment",
      description: "Evaluate your skills and get personalized learning paths",
      icon: "📈",
      category: "Career Tools",
    },
  ];

  const networkContacts = [
    {
      name: "Sarah Chen",
      role: "Senior ML Engineer at Google",
      avatar: "👩‍💻",
      mutualConnections: 12,
      isOnline: true,
    },
    {
      name: "Rajesh Kumar",
      role: "AI Research Lead at Microsoft",
      avatar: "👨‍💼",
      mutualConnections: 8,
      isOnline: false,
    },
    {
      name: "Priya Sharma",
      role: "Data Science Manager at Amazon",
      avatar: "👩‍🔬",
      mutualConnections: 15,
      isOnline: true,
    },
    {
      name: "Alex Johnson",
      role: "Startup Founder - AI Solutions",
      avatar: "👨‍💻",
      mutualConnections: 5,
      isOnline: false,
    },
  ];

  const formatSalary = (salary?: {
    min: number;
    max: number;
    currency: string;
  }) => {
    if (!salary) return "Salary not specified";
    return `${
      salary.currency
    } ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
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
              {
                id: "resources",
                label: "Career Resources",
                count: resources.length,
              },
              {
                id: "network",
                label: "Professional Network",
                count: networkContacts.length,
              },
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
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
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
                          <Link to={`/jobs/${job.id}`}>
                            <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                              View details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "resources" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-4">{resource.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm flex items-center space-x-1">
                      <span>Access</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "network" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Professional Network
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Connect with More
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {networkContacts.map((contact, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-2xl">{contact.avatar}</div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                        <p className="text-xs text-gray-500">
                          {contact.mutualConnections} mutual connections
                        </p>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
