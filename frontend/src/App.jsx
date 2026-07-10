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

function App() {
  const { user, profile, loading, logout, authError } = useAuth();
  console.log('Profile Details in App.jsx', profile);

  useEffect(() => {
    if (authError) {
      toast.error(authError, { duration: 6000 });
    }
  }, [authError]);

  return (
    <>
      <Router>
        <Toaster position="top-right" richColors />
        <Suspense // similar to loading or skeleton but is a built in React component, suitable for lazy loading
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
            <Route
              path="/register"
              element={
                loading && !user ? null : profile ? <Navigate to="/home" replace /> : <Register />
              }
            />
            <Route
              path="/login"
              element={
                loading && !user ? null : profile ? <Navigate to="/home" replace /> : <Login />
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
              <Route path="home" element={<HomePage />} />
              <Route path="whatsapp" element={<LeadDetail />} />
              <Route path="agent-dashboard" element={<AgentDashboard />} />
              <Route path="team-dashboard" element={<LeaderDashboard />} />
              <Route path="speech" element={<Speech />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="profile-setting" element={<ProfileSetting />} />
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
