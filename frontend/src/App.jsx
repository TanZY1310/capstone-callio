import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// //Components
import Register from "./components/Authentication/RegisterForm";
import Login from "./components/Authentication/LoginForm";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import ProfileCard from "./components/Profile-Management/ProfileCard";
import SocialCard from "./components/Profile-Management/SocialCard";
import SheetsCard from "./components/Profile-Management/SheetsCard";
import CredentialCard from "./components/Profile-Management/CredentialCard";
function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = false;
  return (
    <>
      <ProfileCard />
      <SocialCard />
      <SheetsCard />
      <CredentialCard />
    </>
  );
}

export default App;
