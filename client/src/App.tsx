import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HomePage } from "./pages/Home";
import { EventsPage } from "./pages/Events";
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
import { MonthlyEvents } from "./components/dashboard/MonthlyEvents";
import Onboarding from "./pages/Onboarding";
import { SignupForm } from "./components/auth/SignupForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CompanySignupForm } from "./components/auth/CompanySignupForm";
import { CompanyLoginForm } from "./components/auth/CompanyLoginForm";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { CompanyProfilePage } from "./pages/CompanyProfile";
import { JobDetailPage } from "./pages/JobDetail";
import { GlobalJobDetailPage } from "./pages/GlobalJobDetail";
import { GlobalJobs } from "./components/dashboard/GlobalJobs";
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
  return <Navigate to="/dashboard/overview" replace />;
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
        <Route path="/events" element={<EventsPage />} />
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
          <Route path="overview" element={<DashboardStats />} />
          <Route path="jobs" element={<JobResources />} />
          <Route path="jobs/:jobId" element={<JobDetailPage />} />
          <Route path="global-jobs" element={<GlobalJobs />} />
          <Route path="global-jobs/:jobId" element={<GlobalJobDetailPage />} />
          <Route path="events" element={<SpecialEvents />} />
          <Route path="monthly-events" element={<MonthlyEvents />} />
          <Route path="monthly-events/:eventId" element={<MonthlyEvents />} />
          <Route path="community" element={<CommunityHub />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/:companyId" element={<CompanyProfilePage />} />
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
