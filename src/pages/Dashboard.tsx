import React, { useState } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { JobResources } from '../components/dashboard/JobResources';
import { SpecialEvents } from '../components/dashboard/SpecialEvents';
import { CommunityHub } from '../components/dashboard/CommunityHub';
import { UserProfile } from '../components/dashboard/UserProfile';
import { DashboardStats } from '../components/dashboard/DashboardStats';

type DashboardSection = 'overview' | 'jobs' | 'events' | 'community' | 'profile';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardStats />;
      case 'jobs':
        return <JobResources />;
      case 'events':
        return <SpecialEvents />;
      case 'community':
        return <CommunityHub />;
      case 'profile':
        return <UserProfile />;
      default:
        return <DashboardStats />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </main>
      </div>
    </div>
  );
} 