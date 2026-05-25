// import { useState } from "react";
import "./App.css";
import CredentialCard from "./components/Profile-Management/CredentialCard";
// import Sidebar from "./components/Layout/Sidebar";
// import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// //Components
// import Register from "./components/Authentication/Register";
// import Login from "./components/Authentication/Login";
import ProfileCard from "./components/Profile-Management/ProfileCard";
import SheetsCard from "./components/Profile-Management/SheetsCard";
import SocialCard from "./components/Profile-Management/SocialCard";

function App() {
  return (
    <div>
      {/* <BrowserRouter>     
      <nav>
        <Link to="/register">Register</Link> | {" "}
        <Link to="/login">Login</Link> | {" "}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      </BrowserRouter> */}
      <ProfileCard />
      <CredentialCard />
      <SheetsCard />
      <SocialCard />
    </div>
  );
}

export default App;
