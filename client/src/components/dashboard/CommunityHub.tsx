import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Hash, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Bookmark,
  UserPlus,
  Calendar,
  Award
} from 'lucide-react';

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState<'discussions' | 'groups' | 'members'>('discussions');

  const discussions = [
    {
      id: 1,
      title: 'Best practices for deploying ML models in production',
      author: 'Sarah Chen',
      authorAvatar: '👩‍💻',
      content: 'I\'ve been working on deploying ML models and wanted to share some insights about best practices for production environments...',
      category: 'Machine Learning',
      replies: 24,
      likes: 156,
      time: '2 days ago',
      isPinned: true,
      tags: ['MLOps', 'Production', 'Best Practices']
    },
    {
      id: 2,
      title: 'Career advice: Transitioning from Data Analyst to Data Scientist',
      author: 'Rajesh Kumar',
      authorAvatar: '👨‍💼',
      content: 'I\'m currently working as a Data Analyst and looking to transition into a Data Scientist role. Any advice on skills to focus on?',
      category: 'Career Advice',
      replies: 18,
      likes: 89,
      time: '15 hours ago',
      isPinned: false,
      tags: ['Career', 'Transition', 'Skills']
    },
    {
      id: 3,
      title: 'Latest developments in Large Language Models',
      author: 'Priya Sharma',
      authorAvatar: '👩‍🔬',
      content: 'Let\'s discuss the latest breakthroughs in LLMs and their implications for various industries...',
      category: 'AI Research',
      replies: 32,
      likes: 203,
      time: '1 day ago',
      isPinned: false,
      tags: ['LLM', 'Research', 'AI']
    }
  ];

  const groups = [
    {
      id: 1,
      name: 'ML Engineers Network',
      description: 'Connect with fellow ML engineers, share experiences, and discuss technical challenges.',
      members: 847,
      isPrivate: false,
      category: 'Professional',
      avatar: '🤖',
      recentActivity: 'New discussion about MLOps tools',
      tags: ['Machine Learning', 'Engineering', 'Networking']
    },
    {
      id: 2,
      name: 'AI Research Community',
      description: 'For researchers and academics working on cutting-edge AI projects.',
      members: 234,
      isPrivate: true,
      category: 'Research',
      avatar: '🧠',
      recentActivity: 'Paper discussion: "Advances in Transformer Architecture"',
      tags: ['Research', 'Academic', 'AI']
    },
    {
      id: 3,
      name: 'Data Science Career Growth',
      description: 'Career development, job opportunities, and professional growth in data science.',
      members: 1567,
      isPrivate: false,
      category: 'Career',
      avatar: '📊',
      recentActivity: 'New job posting: Senior DS at TechCorp',
      tags: ['Career', 'Jobs', 'Growth']
    },
    {
      id: 4,
      name: 'Startup Founders Circle',
      description: 'Exclusive group for AI startup founders to share insights and network.',
      members: 89,
      isPrivate: true,
      category: 'Entrepreneurship',
      avatar: '🚀',
      recentActivity: 'Pitch deck review session',
      tags: ['Startups', 'Entrepreneurship', 'Networking']
    }
  ];

  const members = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Senior ML Engineer at Google',
      avatar: '👩‍💻',
      location: 'Bangalore, India',
      skills: ['Machine Learning', 'Python', 'TensorFlow', 'MLOps'],
      isOnline: true,
      mutualConnections: 12,
      joined: '2 years ago'
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      role: 'AI Research Lead at Microsoft',
      avatar: '👨‍💼',
      location: 'Mumbai, India',
      skills: ['AI Research', 'PyTorch', 'NLP', 'Computer Vision'],
      isOnline: false,
      mutualConnections: 8,
      joined: '1 year ago'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      role: 'Data Science Manager at Amazon',
      avatar: '👩‍🔬',
      location: 'Delhi, India',
      skills: ['Data Science', 'Leadership', 'Statistics', 'Business Intelligence'],
      isOnline: true,
      mutualConnections: 15,
      joined: '3 years ago'
    },
    {
      id: 4,
      name: 'Alex Johnson',
      role: 'Startup Founder - AI Solutions',
      avatar: '👨‍💻',
      location: 'Hyderabad, India',
      skills: ['Entrepreneurship', 'Product Management', 'AI Strategy'],
      isOnline: false,
      mutualConnections: 5,
      joined: '6 months ago'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Community Hub</h1>
        <p className="text-white/90">Connect with fellow members, join discussions, and grow your professional network.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Hash className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Discussions</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Online Now</p>
              <p className="text-2xl font-bold text-gray-900">342</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'discussions', label: 'Discussions', count: discussions.length },
              { id: 'groups', label: 'Groups', count: groups.length },
              { id: 'members', label: 'Members', count: members.length }
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
          {activeTab === 'discussions' && (
            <div className="space-y-6">
              {/* Search and New Post */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </button>
              </div>

              {/* Discussion List */}
              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">{discussion.authorAvatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                          {discussion.isPinned && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{discussion.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span>By {discussion.author}</span>
                          <span>•</span>
                          <span>{discussion.time}</span>
                          <span>•</span>
                          <span className="text-blue-600">{discussion.category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {discussion.tags.map((tag) => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                              <Heart className="h-4 w-4" />
                              <span>{discussion.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
                              <MessageSquare className="h-4 w-4" />
                              <span>{discussion.replies}</span>
                            </button>
                            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
                              <Share2 className="h-4 w-4" />
                              <span>Share</span>
                            </button>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Available Groups</h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Group</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((group) => (
                  <div key={group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{group.avatar}</div>
                      <div className="flex items-center space-x-2">
                        {group.isPrivate && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            Private
                          </span>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Bookmark className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{group.members} members</span>
                      </div>
                      <span className="text-sm text-gray-500">{group.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {group.tags.map((tag) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{group.recentActivity}</p>
                      <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Community Members</h3>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Invite Friends</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="text-3xl">{member.avatar}</div>
                        {member.isOnline && (
                          <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{member.role}</p>
                        <p className="text-gray-500 text-sm mb-3">{member.location}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {member.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              +{member.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            <span>{member.mutualConnections} mutual connections</span>
                            <span className="mx-2">•</span>
                            <span>Joined {member.joined}</span>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Connect
                          </button>
                        </div>
                      </div>
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