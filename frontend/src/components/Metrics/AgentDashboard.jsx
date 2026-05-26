import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import FunnelCard from "./FunnelCard";
import LeadsByRegion from "./RegionCard";

function AgentDashboard() {
  const [stats, setStats] = useState({
    calls: 0,
    leads: 0,
    pendingFollowUps: 0,
    followUps: 0,
    appointments: 0,
    booking: 0,
  });

  useEffect(() => {
    // pretends get the data
    const data = {
      calls: 50,
      leads: 100,
      pendingFollowUps: 10,
      followUps: 5,
      appointments: 2,
      booking: 1,
    };

    setStats(data);
  }, []);

  return (
    <div style={{ padding: "0 40px" }}>
      <h1>Agent Dashboard</h1>
      <h2>My Dashboard</h2>
      <br></br>

      <div className="flex w-full flex-col">
        <div className="$$card bg-base-300 rounded-box grid h-20 place-items-center">
          <TopCard stats={stats} />
        </div>
        <div className="$$divider"></div>

        <br></br>
        <div className="$$card bg-base-300 rounded-box grid h-20 place-items-center">
          <FunnelCard data={stats} />
        </div>

        <br></br>
        <br></br>

        {/* <div className="$$card bg-base-300 rounded-box grid h-20 place-items-center">
          <LeadsByRegion />
        </div> */}
      </div>

      <br></br>
    </div>
  );
}

export default AgentDashboard;
