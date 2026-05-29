import LeaderDashboard from "./LeaderDashboard";
import AgentDashboard from "./AgentDashboard";

import { useState, useEffect } from "react";

function MainDashboard() {
  const [role, setRole] = useState("");

  useEffect(() => {
    const role = "agent";

    setRole(role);
  }, []);

  return (
    <div>{user === "agent" ? { AgentDashboard } : { LeaderDashboard }}</div>
  );
}
