import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../lib/store';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Award,
  Clock,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export function DashboardStats() {
  const name = useSelector((s: RootState) => s.user.currentUser?.name) || 'there';
  const stats = [
    {
      title: 'Community Members',
      value: '2,847',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Upcoming Events',
      value: '8',
      change: '+3 this week',
      icon: Calendar,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      title: 'Job Opportunities',
      value: '156',
      change: '+23 new',
      icon: Briefcase,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Learning Progress',
      value: '78%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const recentActivity = [
    {
      type: 'event',
      title: 'AI Workshop Registration',
      description: 'You registered for "Advanced AI Applications"',
      time: '2 hours ago',
      icon: Calendar
    },
    {
      type: 'job',
      title: 'New Job Match',
      description: 'Senior ML Engineer at TechCorp matches your profile',
      time: '4 hours ago',
      icon: Briefcase
    },
    {
      type: 'achievement',
      title: 'Course Completed',
      description: 'You completed "Machine Learning Fundamentals"',
      time: '1 day ago',
      icon: Award
    },
    {
      type: 'community',
      title: 'New Discussion',
      description: 'Someone replied to your post in "Career Advice"',
      time: '2 days ago',
      icon: MessageSquare
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {name}! 👋</h1>
        <p className="text-white/90">Here's what's happening in your FutureGPT community today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-green-600 font-medium">{stat.change}</p>
                </div>
                <div className={`h-12 w-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Continue Learning</h3>
          </div>
          <p className="text-gray-600 mb-4">Pick up where you left off in your learning journey.</p>
          <button className="w-full bg-yellow-400 text-blue-900 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
            Resume Course
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Next Event</h3>
          </div>
          <p className="text-gray-600 mb-4">Join our upcoming exclusive workshop.</p>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            View Details
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Job Alerts</h3>
          </div>
          <p className="text-gray-600 mb-4">Check out the latest job opportunities.</p>
          <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Browse Jobs
          </button>
        </div>
      </div>
    </div>
  );
} 