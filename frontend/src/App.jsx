import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// //Components
import Register from "./components/Authentication/RegisterForm";
import Login from "./components/Authentication/LoginForm";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

function App() {
  const [user, setUser] = useState(null);
  const isAuthenticated = false;
  return <></>;
}

export default App;
