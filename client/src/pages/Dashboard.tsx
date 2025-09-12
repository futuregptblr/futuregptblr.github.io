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
import { API_BASE_URL } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../lib/store';
import { setUser } from '../slices/userSlice';

type DashboardSection = 'overview' | 'jobs' | 'events' | 'community' | 'profile' | 'premium';

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const user = useSelector((s: RootState) => s.user.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // Get user data from localStorage or API
    const userData = localStorage.getItem('user');
    if (!userData) {
      const token = localStorage.getItem('token');
      if (token) {
        fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then((res) => res.ok ? res.json() : Promise.reject(res))
          .then((data: any) => {
            // Server returns the user object directly (not wrapped)
            if (data && (data._id || data.id)) {
              const normalizedUser: User = {
                _id: data._id || data.id,
                name: data.name,
                email: data.email,
                isPremium: Boolean(data.isPremium),
                premiumPurchaseDate: data.premiumPurchaseDate ?? null,
                paymentId: data.paymentId ?? null,
                orderId: data.orderId ?? null,
                phone: data.phone,
                location: data.location,
                role: data.role,
                company: data.company,
                bio: data.bio,
                skills: data.skills,
                interests: data.interests,
                resumeUrl: data.resumeUrl,
                experience: data.experience,
                avatar: data.avatar,
                joinDate: data.joinDate,
                profileVisibility: data.profileVisibility,
                showOnlineStatus: data.showOnlineStatus,
                allowDirectMessages: data.allowDirectMessages,
                emailNotifications: data.emailNotifications,
                pushNotifications: data.pushNotifications,
                eventReminders: data.eventReminders,
                jobAlerts: data.jobAlerts,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              } as User;
              dispatch(setUser(normalizedUser));
            }
          })
          .catch(() => {
            // silently ignore; user stays null
          });
      }
    } else {
      try { dispatch(setUser(JSON.parse(userData))); } catch {}
    }
  }, []);

  const handlePremiumPurchaseSuccess = (updatedUser: User) => {
    dispatch(setUser(updatedUser));
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
