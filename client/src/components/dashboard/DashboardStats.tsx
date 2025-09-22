import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState<{ users: number; premiumUsers: number; jobs: number; upcomingEvents: number; teamMembers: number; waitlist: number; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { apiGetStats } = await import('../../lib/api');
        const data = await apiGetStats();
        setStatsData(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      title: 'Community Members',
      value: statsData ? String(statsData.users) : '—',
      change: '',
      icon: Users,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Upcoming Events',
      value: statsData ? String(statsData.upcomingEvents) : '—',
      change: '',
      icon: Calendar,
      color: 'from-yellow-400 to-yellow-500'
    },
    {
      title: 'Job Opportunities',
      value: statsData ? String(statsData.jobs) : '—',
      change: '',
      icon: Briefcase,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Premium Members',
      value: statsData ? String(statsData.premiumUsers) : '—',
      change: '',
      icon: Award,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const [recentActivity, setRecentActivity] = useState<Array<{ type: 'event' | 'job' | 'discussion' | 'user'; title: string; description: string; createdAt: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const { apiGetRecentActivity } = await import('../../lib/api');
        const items = await apiGetRecentActivity();
        const seen: Record<string, boolean> = {};
        const orderedTypes: Array<'event' | 'job' | 'discussion' | 'user'> = ['event', 'job', 'discussion', 'user'];
        const picked: typeof recentActivity = [];
        for (const t of orderedTypes) {
          const found = items.find(i => i.type === t);
          if (found && !seen[t]) {
            seen[t] = true;
            picked.push(found);
          }
        }
        setRecentActivity(picked);
      } catch (err) {
        // ignore
      }
    })();
  }, []);

  function iconFor(type: string) {
    switch (type) {
      case 'event': return Calendar;
      case 'job': return Briefcase;
      case 'discussion': return MessageSquare;
      case 'user': return Users;
      default: return Clock;
    }
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

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
                  {stat.change && <p className="text-xs text-green-600 font-medium">{stat.change}</p>}
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
              const Icon = iconFor(activity.type);
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 flex items-center text-sm text-gray-700">
                    <span className="truncate">{activity.description}</span>
                    <span className="ml-2 text-xs text-gray-400 whitespace-nowrap">{timeAgo(activity.createdAt)}</span>
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
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Events</h3>
          </div>
          <p className="text-gray-600 mb-4">Explore upcoming and past community events.</p>
          <button onClick={() => navigate('/dashboard/events')} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Go to Events
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Jobs</h3>
          </div>
          <p className="text-gray-600 mb-4">Discover the latest job opportunities and resources.</p>
          <button onClick={() => navigate('/dashboard/jobs')} className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Go to Jobs
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Community</h3>
          </div>
          <p className="text-gray-600 mb-4">Join discussions and connect with groups.</p>
          <button onClick={() => navigate('/dashboard/community')} className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Go to Community
          </button>
        </div>
      </div>
    </div>
  );
} 