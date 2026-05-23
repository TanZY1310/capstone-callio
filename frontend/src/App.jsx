import { useState } from "react";
import "./App.css";
import Sidebar from "./components/Layout/Sidebar";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
    <>
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
      
    </>
  );
}

export default App;
