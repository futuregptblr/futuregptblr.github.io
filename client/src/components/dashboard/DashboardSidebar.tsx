import {
  RiDashboardLine,
  RiBriefcaseLine,
  RiCalendarEventLine,
  RiTeamLine,
  RiUser3Line,
  RiVipCrownLine
} from 'react-icons/ri';

type DashboardSection = 'overview' | 'jobs' | 'events' | 'community' | 'profile' | 'premium';

import { useSelector } from 'react-redux';
import type { RootState } from '../../lib/store';
import { Link, useLocation } from 'react-router-dom';

export function DashboardSidebar() {
  const isPremium = useSelector((s: RootState) => Boolean(s.user.currentUser?.isPremium));
  const location = useLocation();
  const path = location.pathname.replace(/\/$/, '');

  const menuItems = [
    {
      id: 'overview' as DashboardSection,
      label: 'Overview',
      icon: RiDashboardLine,
      description: 'Dashboard overview'
    },
    {
      id: 'jobs' as DashboardSection,
      label: 'Job Resources',
      icon: RiBriefcaseLine,
      description: 'Career opportunities'
    },
    {
      id: 'events' as DashboardSection,
      label: 'Events',
      icon: RiCalendarEventLine,
      description: 'Exclusive events'
    },
    {
      id: 'community' as DashboardSection,
      label: 'Community Hub',
      icon: RiTeamLine,
      description: 'Connect with members'
    },
    {
      id: 'premium' as DashboardSection,
      label: isPremium ? 'Premium Status' : 'Premium',
      icon: RiVipCrownLine,
      description: isPremium ? 'You are a premium member' : 'Upgrade membership'
    },
    {
      id: 'profile' as DashboardSection,
      label: 'Profile',
      icon: RiUser3Line,
      description: 'Your account'
    }
  ];

  // Logic to show certain items if premium vs non-premium
  const visibleMenuItems = isPremium
    ? menuItems.filter((item) => item.id !== 'premium')
    : menuItems.filter((item) => ['events', 'premium', 'profile'].includes(item.id));

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-r lg:border-b-0 border-slate-200 flex-shrink-0 relative z-10 lg:min-h-screen">
      <div className="p-4 lg:p-6 overflow-x-auto no-scrollbar lg:sticky lg:top-16 w-full">
        <nav className="flex justify-around lg:justify-start lg:flex-col gap-2 w-full">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const target = `/dashboard/${item.id === 'overview' ? '' : item.id}`.replace(/\/$/, '');
            const isActive = path === '/dashboard'
              ? item.id === 'overview'
              : path === target || (item.id === 'jobs' && path.startsWith('/dashboard/jobs'));

            return (
              <Link
                key={item.id}
                to={target || '/dashboard'}
                className={`flex items-center gap-3 px-4 py-3 lg:py-3 rounded-xl lg:rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-yellow-600'
                  }`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-900' : 'text-gray-500'}`} />
                <div className="text-left whitespace-nowrap lg:whitespace-normal">
                  <div className={`font-bold text-xs lg:text-sm ${isActive ? 'text-blue-900' : 'text-gray-800'}`}>
                    {item.label}
                  </div>
                  <div className={`hidden lg:block text-[10px] lg:text-xs ${isActive ? 'text-blue-800/80' : 'text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
