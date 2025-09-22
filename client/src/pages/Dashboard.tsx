import React, { useEffect } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
// import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Outlet } from 'react-router-dom';
import { User } from '../types';
import { API_BASE_URL } from '../lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../lib/store';
import { setUser } from '../slices/userSlice';

export function Dashboard() {
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

  return (
    <div className="pt-14 min-h-screen bg-gray-50">
      {/* <DashboardHeader /> */}
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
