import { useState, useEffect, useRef } from 'react';
import TopCard from '../components/Metrics/TopCard';
import PerformanceCard from '../components/Metrics/PerformanceCard';
import TeamConversionFunnel from '../components/Metrics/TeamConversionFunnel.jsx';
import Objections from '../components/Metrics/Objections';
import LeadsByRegion from '../components/Metrics/LeadsByRegion';
import Header from '../components/Layout/Header';
import { AlignRight } from 'lucide-react';
import CallUpload from '../components/Metrics/CallUpload';
import BudgetBreakdown from '../components/Metrics/BudgetBreakdown';
import { CiSearch } from 'react-icons/ci';
import { useAuth } from '../hooks/useAuth';
import LeaderCard from '../components/Metrics/LeaderCard';
import api from '../utils/api.js';
import TeamLeadsRegion from '../components/Metrics/TeamLeadsRegion.jsx';
import LocationHeatmap from '../components/Metrics/LocationHeatmap.jsx';

function LeaderDashboard() {
  const [teamData, setTeamData] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');

  const { profile } = useAuth();

  // Fixed-monthly fetch — feeds cards, funnel, region chart. Never reacts to `period`.
  useEffect(() => {
    if (!profile?.user_id) return;

    async function fetchTeamData() {
      setLoading(true);
      try {
        const response = await api.get(`/dashboard/leader/${profile.user_id}`);
        setTeamData(response.data);
      } catch (err) {
        setError(err.message);
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTeamData();
  }, [profile]);

  // Table-only fetch — reacts to `period` toggle, independent of everything else.
  useEffect(() => {
    if (!profile?.user_id) return;

    async function fetchTableData() {
      setTableLoading(true);
      try {
        const response = await api.get(
          `/dashboard/leader/${profile.user_id}/overview?period=${period}`,
        );
        setTableData(response.data);
      } catch (err) {
        console.log(err);
      } finally {
        setTableLoading(false);
      }
    }
    fetchTableData();
  }, [profile, period]);

  if (loading)
    return (
      <div className="card ...">
        <span className="loading loading-spinner loading-md">Loading...</span>
      </div>
    );

  if (error)
    return (
      <div className="card ...">
        <p className="text-error">Couldn't load dashboard stats: {error}</p>
      </div>
    );

  if (!teamData) return null;

  return (
    <>
      <div className="flex h-screen bg-base-200">
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <Header
            h1="Leader Dashboard"
            p="Monitor agent performance and logs"
          />

          <LeaderCard
            calls={teamData.team_stats.team_kpis.calls}
            leads={teamData.team_stats.team_kpis.leads}
            followUps={teamData.team_stats.team_kpis.followUps}
            bookings={teamData.team_stats.team_kpis.bookings}
            completed={teamData.team_stats.team_kpis.completed}
            callsDeltaPct={teamData.team_conversion.calls_change}
            leadsDeltaPct={teamData.team_conversion.leads_change}
            bookingsDeltaPct={teamData.team_conversion.bookings_change}
            completedDeltaPct={teamData.team_conversion.completed_change}
          />

          <div className="col-span-2 card bg-base-100">
            <TeamConversionFunnel
              stages={[
                {
                  label: 'Active Leads',
                  count: teamData.team_stats.team_kpis.leads,
                },
                {
                  label: 'Appointments Set',
                  count: teamData.team_stats.team_kpis.appointments,
                },
                {
                  label: 'Bookings Confirmed',
                  count: teamData.team_stats.team_kpis.bookings,
                },
              ]}
            />
          </div>

          <PerformanceCard
            teamTable={tableData}
            period={period}
            onPeriodChange={setPeriod}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* <div className="col-span-2 card bg-base-100">
              <TeamConversionFunnel
                stages={[
                  {
                    label: 'Active Leads',
                    count: teamData.team_stats.team_kpis.leads,
                  },
                  {
                    label: 'Appointments Set',
                    count: teamData.team_stats.team_kpis.appointments,
                  },
                  {
                    label: 'Bookings Confirmed',
                    count: teamData.team_stats.team_kpis.bookings,
                  },
                ]}
              />
            </div> */}

            {/* Total Regions */}
            {/* 
            <div className="col-span-2 card  bg-base-100">
              <LocationHeatmap locations={teamData.team_stats.team_regions} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaderDashboard;
