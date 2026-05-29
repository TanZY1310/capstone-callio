import { useEffect, useState, lazy } from "react";
import Sidebar from "./components/Layout/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Include page or component imports here
const Register = lazy(() => import('./components/Authentication/RegisterForm'));
const Login = lazy(() => import('./components/Authentication/LoginForm'));
const ProtectedRoute = lazy(() => import('./components/Authentication/ProtectedRoute'));
const HomePage = lazy(() => import('./pages/HomePage'));
const LeadDetail = lazy(() => import('./pages/LeadDetail'));
const MainDashboard = lazy(() => import('./pages/MainDashboard'));
const Speech = lazy(() => import('./pages/Speech'));

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  console.log("User: ", user);
  const isAuthenticated = user !== null;

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/" replace /> : <Register />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login setUser={setUser} />}
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                redirectTo="/login"
              >
                <Sidebar setUser={setUser} />
              </ProtectedRoute>
            }>
              {/* Child routes render into <Outlet /> inside Sidebar.jsx */}
              <Route index element={<HomePage />} />
              <Route path="whatsapp" element={<LeadDetail />} />
              <Route path="metrics" element={<MainDashboard />} />
              <Route path="speech" element={<Speech />} />
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
