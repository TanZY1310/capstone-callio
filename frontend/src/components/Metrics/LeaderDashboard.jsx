import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import PerformanceCard from "./PerformanceCard";
import FunnelCard from "./FunnelCard";
import TeamFunnelCard from "./TeamFunnelCard";

function LeaderDashboard() {
  const [teamStats, setTeamStats] = useState({
    sumApps: 0,
    sumLeads: 0,
    sumFollowUps: 0,
    sumBookings: 0,
  });

  const [stats, setStats] = useState({
    calls: 0,
    leads: 0,
    pendingFollowUps: 0,
    followUps: 0,
    appointments: 0,
    booking: 0,
  });

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

    // pretends get the team data

    const teamData = {
      sumLeads: 100,
      sumFollowUps: 50,
      sumApps: 10,
      sumBookings: 0,
    };

    setStats(data);
    setTeamStats(teamData);
  }, []);

  return (
    <div>
      <h2>My dashboard</h2>
      <TopCard stats={stats} />

      <br></br>
      <h2> Team Overview </h2>

      <PerformanceCard />

      <br></br>
      <TeamFunnelCard teamData={teamStats} />
    </div>
  );
}

export default LeaderDashboard;
