import { lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'sonner';
import ProfileSetting from './pages/ProfileSettings';

// Include page or component imports here
const Register = lazy(() => import('./components/Authentication/RegisterForm'));
const Login = lazy(() => import('./components/Authentication/LoginForm'));
const ProtectedRoute = lazy(
  () => import('./components/Authentication/ProtectedRoute'),
);
const HomePage = lazy(() => import('./pages/HomePage'));
const LeadDetail = lazy(() => import('./pages/LeadDetail'));
const MainDashboard = lazy(() => import('./pages/MainDashboard'));
const Speech = lazy(() => import('./pages/Speech'));
const Sidebar = lazy(() => import('./components/Layout/Sidebar'));
const UserProfile = lazy(() => import('./pages/UserProfile'));

import { useAuth } from './hooks/useAuth';

function App() {
  const { user, setUser, logout } = useAuth();
  const isAuthenticated = user !== null;

  return (
    <>
      <Router>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              >
                <Sidebar logout={logout} />
              </ProtectedRoute>
            }
          >
            {/* Child routes render into <Outlet /> inside Sidebar.jsx */}
            <Route index element={<HomePage />} />
            <Route path="whatsapp" element={<LeadDetail />} />
            <Route path="metrics" element={<MainDashboard />} />
            <Route path="speech" element={<Speech />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="profile/*" element={<UserProfile />} />
            <Route path="profile-setting" element={<ProfileSetting />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
