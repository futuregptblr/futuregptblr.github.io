import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/sections/Hero";
import { Features } from "./components/sections/Features";
import { Community } from "./components/sections/Community";
import { Contact } from "./components/sections/Contact";
import { ChaptersPage } from "./pages/Chapters";
import { TeamPage } from "./pages/Team";
import { Dashboard } from "./pages/Dashboard";
import { SocialFeed } from "./components/social/SocialFeed";
import { SignupForm } from "./components/auth/SignupForm";
import { LoginForm } from "./components/auth/LoginForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { CompanySignupForm } from "./components/auth/CompanySignupForm";
import { CompanyLoginForm } from "./components/auth/CompanyLoginForm";
import { CompanyDashboard } from "./pages/CompanyDashboard";
import { JobsPage } from "./pages/Jobs";
import { JobDetailPage } from "./pages/JobDetail";
import { MemberCount } from "./components/sections/MemberCount";
import { CompanySlider } from "./components/sections/CompanySlider";
// import { Gallery } from './components/sections/Gallery';
import { EventCard } from "./components/events/EventCard";
import { upcomingEvents, pastEvents } from "./data/events";
import { GallerySection } from "./components/sections/GallerySection";
import { PastSpeakers } from "./components/sections/PastSpeakers";
import PaymentCallback from "./components/premium/PaymentCallback.tsx";
import MembershipOffer from "./components/premium/MembershipOffer";
import { PremiumProtectedRoute } from "./components/auth/PremiumProtectedRoute";
import ErrorPage from "./pages/Error";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <main>
                <Hero />
                <MemberCount />
                <Features />
                <CompanySlider />

                {/* Upcoming Events Section */}
                <section className="py-20 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                      Upcoming Events
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {upcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                </section>
                <PastSpeakers />
                <GallerySection />

                <SocialFeed />
                <Community />
                <Contact />
              </main>
            }
          />

          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/company-signup" element={<CompanySignupForm />} />
          <Route path="/company-login" element={<CompanyLoginForm />} />
          <Route
            path="/dashboard"
            element={
              <PremiumProtectedRoute>
                <Dashboard />
              </PremiumProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <PremiumProtectedRoute>
                <JobsPage />
              </PremiumProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId"
            element={
              <PremiumProtectedRoute>
                <JobDetailPage />
              </PremiumProtectedRoute>
            }
          />
          <Route
            path="/membership-offer"
            element={
              <ProtectedRoute>
                <MembershipOffer user={null} />
              </ProtectedRoute>
            }
          />
          <Route path="/company-dashboard" element={<CompanyDashboard />} />

          <Route path="/payment/callback" element={<PaymentCallback />} />

          <Route
            path="/past-events"
            element={
              <div className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Past Events
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => (
                      <EventCard key={event.id} event={event} isPast />
                    ))}
                  </div>
                </div>
              </div>
            }
          />
          {/* Catch-all */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
