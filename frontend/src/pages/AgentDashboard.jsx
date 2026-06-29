import { useState, useEffect } from 'react';
import TopCard from '../components/Metrics/TopCard';
import LeadsByRegion from '../components/Metrics/LeadsByRegion';
import BudgetBreakdown from '../components/Metrics/BudgetBreakdown';
import CallUpload from '../components/Metrics/CallUpload';
import Header from '../components/Layout/Header';
import Objections from '../components/Metrics/Objections';
import ConversionFunnel from '../components/Metrics/FunnelCard.jsx';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js';
import FunnelCard from '../components/Metrics/FunnelCard.jsx';

function AgentDashboard() {
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true); // start TRUE
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:8000';
  const { profile } = useAuth();

  useEffect(() => {
    if (!profile?.user_id) return; // wait until profile is ready

    async function fetchKPIs() {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_URL}/dashboard/agent/${profile.user_id}`,
        );
        setAgent(response.data);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();
  }, [profile]); // re-runs when profile loads

  console.log(agent);

  if (loading)
    return (
      <div className="card ...">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );

  if (error)
    return (
      <div className="card ...">
        <p className="text-error">Couldn't load dashboard stats: {error}</p>
      </div>
    );

  if (!agent) return null; // belt-and-suspenders guard

  return (
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* // Header  */}
          <Header h1="Agent Dashboard" p="Monitor logs and tracks activity" />

          {/* 1. Top Card - Personal Metrics Performance */}
          {/* TopCard({ calls, leads, followUps, appointments }) */}

          <TopCard
            calls={agent.kpis.calls}
            leads={agent.kpis.leads}
            followUps={agent.kpis.followUps}
            appointments={agent.kpis.appointments}
          />

          {/* 2. Line Chart Card - Call Upload Activity*/}

          {/* <div className="card bg-base-100 border border-base-200 shadow-sm">
            <div className="card-body gap-4">
              <h2 className="card-title text-base-content">
                Lead Conversion Funnel
              </h2>
              <FunnelCard data={stats} />
            </div>
          </div> */}

          <CallUpload daily_calls={agent.daily_calls} />

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
              {/* <BudgetBreakdown /> */}
              <ConversionFunnel
                stages={[
                  { label: 'Total Leads', count: agent.kpis.leads },
                  {
                    label: 'Pending Follow-ups',
                    count: agent.kpis.followUps,
                  },
                  { label: 'Appointments Set', count: agent.kpis.appointments },
                ]}
              />
            </div>

            {/* <!-- Main content spanning 2 columns --> */}
            <div className="col-span-2 card  bg-base-100">
              <LeadsByRegion regions={agent.total_region} />
            </div>

            {/* <!-- Sidebar spanning 1 column --> */}
            <div className="col-span-1 card bg-base-100 ">
              <Objections objection={agent.top_objection} />
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

// The data from API will in below form (example)

// {
//   "kpis": {
//     "total_calls_today": 2,
//     "total_leads": 5,
//     "pending_follow_ups": 1,
//     "appointments_booked": 2
//   },
//   "daily_calls": [
//     { "call_date": "2026-06-22", "call_count": 1 },
//     { "call_date": "2026-06-23", "call_count": 1 }
//   ],
//   "regions": [
//     { "region": "Petaling Jaya", "count": 3 },
//     { "region": "Subang Jaya", "count": 2 }
//   ],
//   "top_objections": [
//     { "objection_type": "Too Expensive", "count": 4 },
//     { "objection_type": "Not Interested", "count": 2 }
//   ]
// }

///////////////////////////////////////////////////////////////////
///////////////////// NOT IMPORTANT ///////////////////////////////
///////////////////////////////////////////////////////////////////

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
