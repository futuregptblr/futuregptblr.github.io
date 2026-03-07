import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/Home";
import { ChaptersPage } from "./pages/Chapters";
import { TeamPage } from "./pages/Team";
import { AboutPage } from "./pages/About";
import { Dashboard } from "./pages/Dashboard";
import { DashboardStats } from "./components/dashboard/DashboardStats";
import { JobResources } from "./components/dashboard/JobResources";
import { SpecialEvents } from "./components/dashboard/SpecialEvents";
import { EventDetail } from "./components/dashboard/EventDetail";
import { CommunityHub } from "./components/dashboard/CommunityHub";
import { UserProfile } from "./components/dashboard/UserProfile";
import PremiumMembershipCard from "./components/premium/PremiumMembershipCard";
import { useSelector } from 'react-redux';
import type { RootState } from './lib/store';
import Onboarding from "./pages/Onboarding";
import { SignupForm } from "./components/auth/SignupForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CompanySignupForm } from "./components/auth/CompanySignupForm";
import { CompanyLoginForm } from "./components/auth/CompanyLoginForm";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { CompanyProfilePage } from "./pages/CompanyProfile";
import { JobDetailPage } from "./pages/JobDetail";
import PaymentCallback from "./components/premium/PaymentCallback.tsx";
import MembershipOffer from "./components/premium/MembershipOffer";
import MembershipWaitlist from "./components/premium/MembershipWaitlist";
import { PremiumProtectedRoute } from "./components/auth/PremiumProtectedRoute";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorPage from "./pages/Error";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsConditionsPage from "./pages/TermsConditions";
import AdminPage from "./pages/Admin";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import { PastEventsPage } from "./pages/PastEvents";

const DashboardIndexRedirect = () => {
  const userRaw = localStorage.getItem('user');
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch (e) { }
  if (user?.isPremium) {
    return <Navigate to="/dashboard/overview" replace />;
  }
  return <Navigate to="/dashboard/events" replace />;
};

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapters" element={<ChaptersPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/company-signup" element={<CompanySignupForm />} />
        <Route path="/company-login" element={<CompanyLoginForm />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardIndexRedirect />} />
          <Route path="overview" element={<PremiumProtectedRoute><DashboardStats /></PremiumProtectedRoute>} />
          <Route path="jobs" element={<PremiumProtectedRoute><JobResources /></PremiumProtectedRoute>} />
          <Route path="jobs/:jobId" element={<PremiumProtectedRoute><JobDetailPage /></PremiumProtectedRoute>} />
          <Route path="events" element={<SpecialEvents />} />
          <Route path="community" element={<PremiumProtectedRoute><CommunityHub /></PremiumProtectedRoute>} />
          <Route path="profile" element={<UserProfile />} />
          <Route
            path="premium"
            element={
              <PremiumProtectedRoute>
                {(() => {
                  // eslint-disable-next-line react-hooks/rules-of-hooks
                  const user = (useSelector((s: RootState) => s.user.currentUser));
                  return user ? (
                    <div className="max-w-2xl mx-auto">
                      <PremiumMembershipCard user={user} onPurchaseSuccess={() => { }} />
                    </div>
                  ) : (
                    <div>Loading...</div>
                  );
                })()}
              </PremiumProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/membership-offer"
          element={
            <ProtectedRoute>
              <MembershipOffer user={null} />
            </ProtectedRoute>
          }
        />
        <Route path="/membership-waitlist" element={<MembershipWaitlist user={null} />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/:companyId" element={<CompanyProfilePage />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        <Route path="/events/:eventId" element={<div className="pt-16 min-h-screen bg-slate-50 pb-20"><EventDetail /></div>} />
        <Route path="/past-events" element={<PastEventsPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsConditionsPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      {!isAdminPage && <Footer />}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
