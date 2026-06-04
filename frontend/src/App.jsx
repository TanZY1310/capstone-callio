import { useEffect, useState, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import TopCard from "./components/Metrics/TopCard";
import LeaderDashboard from "./components/Metrics/LeaderDashboard";

// Include page or component imports here
const Register = lazy(() => import("./components/Authentication/RegisterForm"));
const Login = lazy(() => import("./components/Authentication/LoginForm"));
const ProtectedRoute = lazy(
  () => import("./components/Authentication/ProtectedRoute"),
);
const HomePage = lazy(() => import("./pages/HomePage"));
const LeadDetail = lazy(() => import("./pages/LeadDetail"));
const MainDashboard = lazy(() => import("./pages/MainDashboard"));
const Speech = lazy(() => import("./pages/Speech"));
const Sidebar = lazy(() => import("./components/Layout/Sidebar"));
const UserProfile = lazy(() => import("./pages/UserProfile"));

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  console.log("User: ", user);
  const isAuthenticated = user !== null;

  return (
    <>
      <LeaderDashboard />
    </>
  );
}

export default App;
