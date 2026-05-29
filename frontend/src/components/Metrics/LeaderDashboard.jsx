import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import PerformanceCard from "./PerformanceCard";
import FunnelCard from "./FunnelCard";
import TeamFunnelCard from "./TeamFunnelCard";
import Objections from "./Objections";
import LeadsByRegion from "./LeadsByRegion";

function LeaderDashboard() {
  const [teamStats, setTeamStats] = useState({});
  const [stats, setStats] = useState({});
  const [teamRegion, setTeamRegion] = useState([]);

  useEffect(() => {
    // pretends get the personal data
    const data = {
      calls: 100,
      leads: 50,
      pendingFollowUps: 20,
      followUps: 5,
      appointments: 3,
      booking: 1,
    };

    // pretends get the team callls data
    const teamData = {
      sumLeads: 100,
      sumFollowUps: 50,
      sumApps: 10,
      sumBookings: 0,
    };

    // pretends get the team region data

    setStats(data);
    setTeamStats(teamData);
  }, []);

  return (
    <div>
      {/* // Header  */}
      <div className="navbar bg-base-100 shadow-sm" style={{ color: "white" }}>
        <h2>Leader Dashboard</h2>
      </div>

      {/* 1. Top Card - Personal Metrics Performance */}

      <div className="flex w-full flex-col">
        <div className="card-body">
          <div className="card-title">
            <h2>Personal Performance</h2>
          </div>
          <TopCard stats={stats} />
        </div>

        {/* 2. Funnel Card - Metrics Performance Transition*/}

        <div className="card-body">
          <h2 className="card-title">Team Funnel</h2>
          <TeamFunnelCard teamData={teamStats} />
        </div>

        {/* 3. Team Performance*/}

        <div className="card-body">
          <h2 className="card-title">Agent Performance</h2>
          <PerformanceCard />
        </div>

        {/* 4. Bottom Card */}

        <div className="card-body">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="card bg-base-300 rounded-box p-5 grid place-items-center">
              <Objections />
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

export default LeaderDashboard;
