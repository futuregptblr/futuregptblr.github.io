import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import { CommunityHub } from "./components/dashboard/CommunityHub";
import { UserProfile } from "./components/dashboard/UserProfile";
import PremiumMembershipCard from "./components/premium/PremiumMembershipCard";
import { useSelector } from 'react-redux';
import type { RootState } from './lib/store';
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
        <Route path="/login" element={<LoginForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/company-signup" element={<CompanySignupForm />} />
        <Route path="/company-login" element={<CompanyLoginForm />} />

        <Route
          path="/dashboard"
          element={
            <PremiumProtectedRoute>
              <Dashboard />
            </PremiumProtectedRoute>
          }
        >
          <Route index element={<DashboardStats />} />
          <Route path="overview" element={<DashboardStats />} />
          <Route path="jobs" element={<JobResources />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
          <Route path="events" element={<SpecialEvents />} />
          <Route path="community" element={<CommunityHub />} />
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
