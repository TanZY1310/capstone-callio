import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import FunnelCard from "./FunnelCard";
import LeadsByRegion from "./LeadsByRegion";
import BudgetBreakdown from "./BudgetBreakdown";
import { data } from "react-router-dom";

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
    <div>
      {/* // Header  */}
      <div className="navbar bg-base-100 shadow-sm" style={{ color: "white" }}>
        <h2>My Dashboard</h2>
      </div>

      {/* 1. Top Card - Personal Metrics Performance */}

      <div className="flex w-full flex-col">
        <div className="card-body">
          <TopCard stats={stats} />
        </div>

        {/* 2. Funnel Card - Metrics Performance Transition*/}

        <div className="card-body">
          <h2 className="card-title">Lead Conversation Funnel</h2>
          <FunnelCard data={stats} />
        </div>

        {/* 3. Divider Part - LeadsByRegion + Leads Budget Breakdown*/}

        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-base-300 rounded-box p-5 grid place-items-center">
              <BudgetBreakdown />
            </div>

            <div className="card bg-base-300 rounded-box p-5">
              <LeadsByRegion />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgentDashboard;
