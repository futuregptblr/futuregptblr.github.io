import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Users,
  BookOpen,
  MessageSquare,
  Filter,
  Search,
  Star,
  ExternalLink
} from 'lucide-react';

export function JobResources() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'resources' | 'network'>('jobs');

  const jobs = [
    {
      id: 1,
      title: 'Senior Machine Learning Engineer',
      company: 'TechCorp India',
      location: 'Bangalore, India',
      salary: '$80K - $120K',
      type: 'Full-time',
      posted: '2 days ago',
      skills: ['Python', 'TensorFlow', 'AWS', 'MLOps'],
      isPremium: true,
      logo: '🏢'
    },
    {
      id: 2,
      title: 'AI Research Scientist',
      company: 'InnovateAI',
      location: 'Mumbai, India',
      salary: '$90K - $140K',
      type: 'Full-time',
      posted: '3 days ago',
      skills: ['Research', 'PyTorch', 'NLP', 'Computer Vision'],
      isPremium: true,
      logo: '🔬'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'DataFlow Solutions',
      location: 'Remote',
      salary: '$70K - $100K',
      type: 'Full-time',
      posted: '1 week ago',
      skills: ['Python', 'SQL', 'Statistics', 'Tableau'],
      isPremium: false,
      logo: '📊'
    },
    {
      id: 4,
      title: 'MLOps Engineer',
      company: 'CloudTech',
      location: 'Hyderabad, India',
      salary: '$75K - $110K',
      type: 'Full-time',
      posted: '4 days ago',
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
      isPremium: true,
      logo: '☁️'
    }
  ];

  const resources = [
    {
      title: 'Resume Builder',
      description: 'Create professional resumes with AI-powered suggestions',
      icon: '📝',
      category: 'Career Tools'
    },
    {
      title: 'Interview Prep',
      description: 'Practice with AI mock interviews and get feedback',
      icon: '🎯',
      category: 'Career Tools'
    },
    {
      title: 'Salary Negotiation Guide',
      description: 'Learn strategies for negotiating better compensation',
      icon: '💰',
      category: 'Career Tools'
    },
    {
      title: 'Networking Events',
      description: 'Connect with industry professionals at exclusive events',
      icon: '🤝',
      category: 'Networking'
    },
    {
      title: 'Mentorship Program',
      description: 'Get paired with experienced professionals in your field',
      icon: '👨‍🏫',
      category: 'Networking'
    },
    {
      title: 'Skill Assessment',
      description: 'Evaluate your skills and get personalized learning paths',
      icon: '📈',
      category: 'Career Tools'
    }
  ];

  const networkContacts = [
    {
      name: 'Sarah Chen',
      role: 'Senior ML Engineer at Google',
      avatar: '👩‍💻',
      mutualConnections: 12,
      isOnline: true
    },
    {
      name: 'Rajesh Kumar',
      role: 'AI Research Lead at Microsoft',
      avatar: '👨‍💼',
      mutualConnections: 8,
      isOnline: false
    },
    {
      name: 'Priya Sharma',
      role: 'Data Science Manager at Amazon',
      avatar: '👩‍🔬',
      mutualConnections: 15,
      isOnline: true
    },
    {
      name: 'Alex Johnson',
      role: 'Startup Founder - AI Solutions',
      avatar: '👨‍💻',
      mutualConnections: 5,
      isOnline: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Job Resources & Career Hub</h1>
        <p className="text-white/90">Access exclusive job opportunities, career tools, and professional networking.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'jobs', label: 'Job Opportunities', count: jobs.length },
              { id: 'resources', label: 'Career Resources', count: resources.length },
              { id: 'network', label: 'Professional Network', count: networkContacts.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
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
          {activeTab === 'jobs' && (
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Job Listings */}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{job.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            {job.isPremium && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                Premium
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{job.company}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>{job.type}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 mb-2">{job.posted}</p>
                        <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-4">{resource.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
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

          {activeTab === 'network' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Professional Network</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Connect with More
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {networkContacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="text-2xl">{contact.avatar}</div>
                        {contact.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.role}</p>
                        <p className="text-xs text-gray-500">{contact.mutualConnections} mutual connections</p>
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