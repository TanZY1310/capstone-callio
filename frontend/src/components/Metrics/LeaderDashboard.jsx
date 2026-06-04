import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import PerformanceCard from "./PerformanceCard";
import FunnelCard from "./FunnelCard";
import TeamFunnelCard from "./TeamFunnelCard";
import Objections from "./Objections";
import LeadsByRegion from "./LeadsByRegion";
import Header from "../Layout/Header";
import { AlignRight } from "lucide-react";
import CallUpload from "./CallUpload";
import BudgetBreakdown from "./BudgetBreakdown";
import { CiSearch } from "react-icons/ci";
import { dummyAgentPerformance } from "../../data/dummyAgentPerformance";
import { dummyAgentData } from "../../data/dummyAgentData";
import { dummyTeamData } from "../../data/dummyTeamData";

function LeaderDashboard() {
  // const [teamStats, setTeamStats] = useState({});
  // const [stats, setStats] = useState({});
  // const [teamRegion, setTeamRegion] = useState([]);

  // useEffect(() => {
  //   // pretends get the personal data
  //   const data = {
  //     calls: 100,
  //     leads: 50,
  //     pendingFollowUps: 20,
  //     followUps: 5,
  //     appointments: 3,
  //     booking: 1,
  //   };

  //   // pretends get the team callls data
  //   const teamData = {
  //     sumLeads: 100,
  //     sumFollowUps: 50,
  //     sumApps: 10,
  //     sumBookings: 0,
  //   };

  //   // pretends get the team region data

  //   setStats(data);
  //   setTeamStats(teamData);
  // }, []);

  return (
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* // Header  */}
          <Header
            h1="Leader Dashboard"
            p="Monitor agent performance and logs"
          />

          {/* 1. Top Card - Personal Metrics Performance */}

          <TopCard dummyAgentData={dummyAgentData} />

          {/* 2. Bar Chart Card - Call Upload*/}

          <CallUpload />

          {/* 3. Team Performance*/}

          <PerformanceCard dummyAgentPerformance={dummyAgentPerformance} />

          {/* 4. Bottom Card */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* <h2 className="card-title text-base-content">
                Team Budget Breakdown
              </h2>  */}
            <BudgetBreakdown />

            <Objections />

            <LeadsByRegion />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaderDashboard;
