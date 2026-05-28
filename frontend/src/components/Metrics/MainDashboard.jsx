import LeaderDashboard from "./LeaderDashboard";
import AgentDashboard from "./AgentDashboard";

import { useState, useEffect } from "react";

function MainDashboard() {
  const [user, setUser] = useState("");

  useEffect(() => {
    const users = "agent";

    setUser(users);
  }, []);

  return (
    <div>{user === "agent" ? { AgentDashboard } : { LeaderDashboard }}</div>
  );
}
