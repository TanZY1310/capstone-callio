import LeaderDashboard from "../components/Metrics/LeaderDashboard";
import AgentDashboard from "../components/Metrics/AgentDashboard";

import { useState, useEffect } from "react";

function MainDashboard() {
  const [role, setRole] = useState("");
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });


  useEffect(() => {
    const role = "agent";

    setRole(role);
  }, []);

  return (
    <div>{user.role === "agent" ? < AgentDashboard /> : < LeaderDashboard />}</div>
  );
}

export default MainDashboard;
