import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { useAuth } from './hooks/useAuth';

// Include page or component imports here
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Register = lazy(() => import('./components/Authentication/RegisterForm'));
const Login = lazy(() => import('./components/Authentication/LoginForm'));
const ProtectedRoute = lazy(
  () => import('./components/Authentication/ProtectedRoute'),
);
const HomePage = lazy(() => import('./pages/HomePage'));
const LeadDetail = lazy(() => import('./pages/LeadDetail'));
const AgentDashboard = lazy(() => import('./pages/AgentDashboard'));
const LeaderDashboard = lazy(() => import('./pages/LeaderDashboard'));
const Speech = lazy(() => import('./pages/Speech'));
const Sidebar = lazy(() => import('./components/Layout/Sidebar'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const ProfileSetting = lazy(() => import('./pages/ProfileSettings'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));

function App() {
  const { user, profile, loading, logout, authError, loginDemo } = useAuth();

  useEffect(() => {
    if (authError) {
      toast.error(authError, { duration: 6000 });
    }
  }, [authError]);

  const contentFallback = (
    <div className="flex-1 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );

  return (
    <>
      <Router>
        <Toaster position="top-right" richColors />
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-base-100">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          <Routes>
            <Route
              path="/landing"
              element={<Navigate to="/" replace />}
            />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route
              path="/register"
              element={
                loading && !user ? null : profile ? <Navigate to="/home" replace /> : <Register />
              }
            />
            <Route
              path="/login"
              element={
                loading && !user ? null : profile ? <Navigate to="/home" replace /> : <Login onDemoLogin={loginDemo} />
              }
            />
            <Route
              path="/"
              element={
                loading ? null : !profile ? <LandingPage /> : <Navigate to="/home" replace />
              }
            />
            <Route
              path="/*"
              element={
                <ProtectedRoute
                  user={user}
                  loading={loading}
                  redirectTo="/login"
                >
                  <Sidebar logout={logout} profile={profile} />
                </ProtectedRoute>
              }
            >
              {/* Child routes render into <Outlet /> inside Sidebar.jsx */}
              <Route path="home" element={<Suspense fallback={contentFallback}><HomePage /></Suspense>} />
              <Route path="whatsapp" element={<Suspense fallback={contentFallback}><LeadDetail /></Suspense>} />
              <Route path="agent-dashboard" element={<Suspense fallback={contentFallback}><AgentDashboard /></Suspense>} />
              <Route path="team-dashboard" element={<Suspense fallback={contentFallback}><LeaderDashboard /></Suspense>} />
              <Route path="speech" element={<Suspense fallback={contentFallback}><Speech /></Suspense>} />
              <Route path="profile" element={<Suspense fallback={contentFallback}><UserProfile /></Suspense>} />
              <Route path="profile-setting" element={<Suspense fallback={contentFallback}><ProfileSetting /></Suspense>} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
