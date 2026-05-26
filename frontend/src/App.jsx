import { useEffect, useState, lazy } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

// Include page or component imports here
// import Register from "./components/Authentication/RegisterForm";
// import Login from "./components/Authentication/LoginForm";
// import ProtectedRoute from "./components/Authentication/ProtectedRoute";

const Register = lazy(() => import('./components/Authentication/RegisterForm'));
const Login = lazy(() => import('./components/Authentication/LoginForm'));
const ProtectedRoute = lazy(() => import('./components/Authentication/ProtectedRoute'));

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
              {/* <Route index element={<CustomerListings />} />
              <Route path="speech" element={<SpeechAnalysis />} />
              <Route path="whatsapp" element={<WhatsApp />} />
              <Route path="metrics" element={<Metrics />} /> */}
            </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
