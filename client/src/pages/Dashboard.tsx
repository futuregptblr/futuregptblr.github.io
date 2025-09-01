import React, { useState, useEffect } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { JobResources } from '../components/dashboard/JobResources';
import { SpecialEvents } from '../components/dashboard/SpecialEvents';
import { CommunityHub } from '../components/dashboard/CommunityHub';
import { UserProfile } from '../components/dashboard/UserProfile';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import PremiumMembershipCard from '../components/premium/PremiumMembershipCard';
import { User } from '../types';

type DashboardSection = 'overview' | 'jobs' | 'events' | 'community' | 'profile' | 'premium';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    else {
      const token = localStorage.getItem('token');
      if (token) {
        fetch('/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => res.ok ? res.json() : Promise.reject(res))
          .then((data) => {
            if (data?.user) {
              const u = { id: data.user._id || data.user.id, name: data.user.name, email: data.user.email, isPremium: data.user.isPremium, premiumPurchaseDate: data.user.premiumPurchaseDate };
              setUser(u);
              localStorage.setItem('user', JSON.stringify(u));
            }
          })
          .catch(() => {
            // silently ignore; user stays null
          });
      }
    }
  }, []);

  const handlePremiumPurchaseSuccess = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

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
      case 'premium':
        return user ? (
          <div className="max-w-2xl mx-auto">
            <PremiumMembershipCard 
              user={user} 
              onPurchaseSuccess={handlePremiumPurchaseSuccess}
            />
          </div>
        ) : (
          <div>Loading...</div>
        );
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
