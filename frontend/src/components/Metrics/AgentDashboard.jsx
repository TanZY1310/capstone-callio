import { useState, useEffect } from "react";
import TopCard from "./TopCard";
import FunnelCard from "./FunnelCard";
import LeadsByRegion from "./LeadsByRegion";
import BudgetBreakdown from "./BudgetBreakdown";
import CallUpload from "./CallUpload";
import { data } from "react-router-dom";
import Header from "../Layout/Header";
import Objections from "./Objections";
import { dummyAgentData } from "../../data/dummyAgentData";

function AgentDashboard() {
  // const [stats, setStats] = useState({
  //   calls: 0,
  //   leads: 0,
  //   pendingFollowUps: 0,
  //   followUps: 0,
  //   appointments: 0,
  //   booking: 0,
  // });

  // useEffect(() => {
  //   // pretends get the data
  //   const data = {
  //     calls: 50,
  //     leads: 100,
  //     pendingFollowUps: 10,
  //     followUps: 5,
  //     appointments: 2,
  //     booking: 1,
  //   };

  //   setStats(data);
  // }, []);

  return (
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* // Header  */}
          <Header h1="Agent Dashboard" p="Monitor logs and tracks activity" />

          {/* 1. Top Card - Personal Metrics Performance */}

          <TopCard dummyAgentData={dummyAgentData} />

          {/* 2. Bar Chart Card - Call Upload Activity*/}

          {/* <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-4">
              <h2 className="card-title text-base-content">
                Lead Conversion Funnel
              </h2>
              <FunnelCard data={stats} />
            </div>
          </div> */}

          <CallUpload />

          {/* 3. Divider Part - LeadsByRegion + Leads Budget Breakdown*/}

          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BudgetBreakdown />

            <Objections />

            <LeadsByRegion />
          </div> */}

          {/* <!-- 3-Column Grid Layout --> */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* <!-- Main content spanning 2 columns --> */}
            <div className="col-span-2 card  bg-base-100 ">
              <BudgetBreakdown />
            </div>

            {/* <!-- Main content spanning 2 columns --> */}
            <div className="col-span-2 card  bg-base-100">
              <LeadsByRegion />
            </div>

            {/* <!-- Sidebar spanning 1 column --> */}
            <div className="col-span-1 card bg-base-100 ">
              <Objections />
            </div>
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <BudgetBreakdown />

            <Objections />

            <LeadsByRegion />
          </div> */}
        </div>
      </div>
    </>
  );
}

export default AgentDashboard;
