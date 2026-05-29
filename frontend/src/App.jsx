import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Body from "./components/Speech/speech-to-text-body";

// //Components
import Register from "./components/Authentication/RegisterForm";
import Login from "./components/Authentication/LoginForm";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import Speech from "./components/Speech/Speech-to-text-main";

function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = false;
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login onLogin={(username) => setUser(username)} />}
          />
          <Route path="/speech" element={<Speech />} />
          <Route
            path="/"
            element={
              user ? <Sidebar user={user} /> : <Navigate to="/login" replace />
            }
          />
          {/* <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Sidebar />
            </ProtectedRoute>
          } /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
