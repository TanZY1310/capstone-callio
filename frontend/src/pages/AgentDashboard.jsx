import { useState, useEffect } from 'react';
import TopCard from '../components/Metrics/TopCard';
import LeadsByRegion from '../components/Metrics/LeadsByRegion';
import BudgetBreakdown from '../components/Metrics/BudgetBreakdown';
import CallUpload from '../components/Metrics/CallUpload';
import Header from '../components/Layout/Header';
import Objections from '../components/Metrics/Objections';
import ConversionFunnel from '../components/Metrics/ConversionFunnel.jsx';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import DailyCallPoint from '../components/Metrics/DailyCallPoint.jsx';

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

function AgentDashboard() {
  // --- for KPI ---
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { profile } = useAuth();

  // --- Daily Call Volume state ---
  const today = new Date();
  const [calls, setCalls] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [year] = useState(today.getFullYear());
  const [month] = useState(today.getMonth() + 1);
  const [day] = useState(today.getDate());
  const [dcLoading, setDcLoading] = useState(true);
  const [dcError, setDcError] = useState(null);

  // --- Main agent KPI fetch useEffect ---
  useEffect(() => {
    if (!profile?.user_id) return; // if False, return.
    // This is a guard clause
    // The ?. is called optional chaining.
    // "Does profile exist? If yes, get user_id. If no, return undefined."
    // if use normal profile.user_id, when the profile is null, the JS crash

    // --- FETCHING KPIS AGENT ---
    async function fetchKPIs() {
      setLoading(true);

      const params = new URLSearchParams({
        period,
        year,
        month,
        day,
      });

      try {
        const res = await api.get(
          `/dashboard/agent?user_id=${profile.user_id}&${params}`,
        );
        setAgent(res.data);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchKPIs();
  }, [profile, period, year, month, day]);

  console.log(agent);

  // --- Call Volume fetch, separate effect ---
  useEffect(() => {
    if (!profile?.user_id) return;

    const params = new URLSearchParams({
      period,
      year,
      month,
      day,
    });

    async function fetchCalls() {
      setDcLoading(true);
      try {
        const response = await api.get(
          `/dashboard/calls?user_id=${profile.user_id}&${params}`,
        );
        console.log(response.data);
        setCalls(response.data);
      } catch (err) {
        setDcError(err.message);
        console.log(err);
      } finally {
        setDcLoading(false);
      }
    }
    fetchCalls();
  }, [profile, period, year, month, day]);

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

  if (!agent) return null;

  return (
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="flex items-center justify-between">
            {/* With justify-between, the first child is pushed to the far left and the last child to the far right. */}
            {/* items-center -> makes the naming is centered vertically */}
            {/* flex container as a row */}

            <Header h1="Agent Dashboard" p="Monitor logs and tracks activity" />

            {/* name of each tab group should be unique */}
            <div className="tabs tabs-box">
              {['daily', 'monthly'].map((item) => (
                <button
                  key={item}
                  className={`tab ${period === item ? 'tab-active' : ''}`} // this line just basically to highlight the tab selected
                  onClick={() => setPeriod(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <TopCard
            period={period}
            leads={agent.kpis.leads}
            calls={agent.kpis.calls}
            followUps={agent.kpis.followUps}
            appointments={agent.kpis.appointments}
            bookings={agent.kpis.bookings}
          />

          <CallUpload
            calls={calls}
            // loading={dcLoading}
            error={dcError}
            period={period}
            year={year}
            month={month}
            day={day}
          />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="col-span-3 card bg-base-100">
              <ConversionFunnel
                stages={[
                  { label: 'Active Leads', count: agent.kpis.leads },
                  // { label: 'Follow Ups', count: agent.kpis.followUps },
                  { label: 'Appointments Set', count: agent.kpis.appointments },
                  { label: 'Bookings Confirmed', count: agent.kpis.bookings },
                ]}
              />
            </div>

            <div className="col-span-2 card bg-base-100">
              <Objections objection={agent.top_objection} />
            </div>

            {/* <div className="col-span-2 card bg-base-100">
              <LeadsByRegion regions={agent.total_region} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AgentDashboard;
