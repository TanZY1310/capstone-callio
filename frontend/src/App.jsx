import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// //Components
import Register from "./components/Authentication/Register";
import Login from "./components/Authentication/Login";

function App() {
  const [count, setCount] = useState(0);

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
