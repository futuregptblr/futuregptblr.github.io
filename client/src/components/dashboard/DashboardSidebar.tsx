import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Users, 
  User, 
  Crown,
  BookOpen,
  MessageSquare,
  Settings
} from 'lucide-react';

type DashboardSection = 'overview' | 'jobs' | 'events' | 'community' | 'profile' | 'premium';

interface DashboardSidebarProps {
  activeSection: DashboardSection;
  onSectionChange: (section: DashboardSection) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const menuItems = [
    {
      id: 'overview' as DashboardSection,
      label: 'Overview',
      icon: LayoutDashboard,
      description: 'Dashboard overview'
    },
    {
      id: 'jobs' as DashboardSection,
      label: 'Job Resources',
      icon: Briefcase,
      description: 'Career opportunities'
    },
    {
      id: 'events' as DashboardSection,
      label: 'Special Events',
      icon: Calendar,
      description: 'Exclusive events'
    },
    {
      id: 'community' as DashboardSection,
      label: 'Community Hub',
      icon: Users,
      description: 'Connect with members'
    },
    {
      id: 'premium' as DashboardSection,
      label: 'Premium',
      icon: Crown,
      description: 'Upgrade membership'
    },
    {
      id: 'profile' as DashboardSection,
      label: 'Profile',
      icon: User,
      description: 'Your account'
    }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-900' : 'text-gray-500'}`} />
                <div className="text-left">
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${isActive ? 'text-blue-800' : 'text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <BookOpen className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Learning Path</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Discussions</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Settings className="h-4 w-4 text-gray-500" />
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
