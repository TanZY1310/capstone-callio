import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// //Components
import Register from "./components/Authentication/Register";
import Login from "./components/Authentication/Login";

function App() {

  return (
    <>
      <BrowserRouter>     
      <nav>
        <Link to="/register">Register</Link> | {" "}
        <Link to="/login">Login</Link> | {" "}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
