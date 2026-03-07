import { useEffect } from 'react';
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar';
// import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { Outlet, useLocation } from 'react-router-dom';
import { User } from '../types';
import { API_BASE_URL } from '../lib/utils';
import { useDispatch } from 'react-redux';
import { setUser } from '../slices/userSlice';

export function Dashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isEventDetailPage = /^\/dashboard\/events\/[^/]+$/.test(location.pathname);

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
      try { dispatch(setUser(JSON.parse(userData))); } catch { }
    }
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-slate-50 flex flex-col">
      <div className="flex flex-col lg:flex-row flex-1">
        {!isEventDetailPage && <DashboardSidebar />}
        <main className="flex-1 p-4 lg:p-10 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto w-full lg:min-h-[calc(100vh-8rem)]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
