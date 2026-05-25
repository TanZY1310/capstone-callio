import { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// //Components
import Register from "./components/Authentication/RegisterForm";
import Login from "./components/Authentication/LoginForm";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  const currentUser = localStorage.getItem("currentUser");
  console.log("Current User: ", currentUser);
  console.log("User: ", user);

  let isAuthenticated = false;
  if (localStorage.getItem('currentUser') != null) {
    isAuthenticated = true;
  }

  const handleLogin = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sidebar user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
