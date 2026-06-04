import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import FunnelCard from "./FunnelCard";
import LeadsByRegion from "./LeadsByRegion";
import BudgetBreakdown from "./BudgetBreakdown";
import CallUpload from "./CallUpload";
import { data } from "react-router-dom";
import Header from "../Layout/Header";
import Objections from "./Objections";

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
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* // Header  */}
          <Header h1="Agent Dashboard" p="Monitor logs and tracks activity" />

          {/* 1. Top Card - Personal Metrics Performance */}

          <TopCard stats={stats} />

          {/* 2. Bar Chart Card - Call Upload Activity*/}

          {/* <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-4">
              <h2 className="card-title text-base-content">
                Lead Conversion Funnel
              </h2>
              <FunnelCard data={stats} />
            </div>
          </div> */}

          <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-base-content">
                Weekly Call Volume
              </h2>
              <p>Monday - Friday (Current Week)</p>

              <CallUpload />
            </div>
          </div>

          {/* 3. Divider Part - LeadsByRegion + Leads Budget Breakdown*/}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <h2 className="card-title text-base-content">
                Lead Budget Breakdown
              </h2>
              <BudgetBreakdown />
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <h2 className="card-title text-base-content">Region Breakdown</h2>
              <LeadsByRegion />
            </div>

            <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
              <h2
                className="card-title text-base-content"
                // style={{ padding: "5px" }}
              >
                Top Objections
              </h2>
              <Objections />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AgentDashboard;
