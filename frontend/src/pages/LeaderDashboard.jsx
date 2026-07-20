import { useState, useEffect } from 'react';
import PerformanceCard from '../components/Metrics/PerformanceCard';
import TeamConversionFunnel from '../components/Metrics/TeamConversionFunnel.jsx';
import Header from '../components/Layout/Header';
import { useAuth } from '../hooks/useAuth';
import LeaderCard from '../components/Metrics/LeaderCard';
import api from '../utils/api.js';
import LocationHeatmap from '../components/Metrics/LocationHeatmap.jsx';

function LeaderDashboard() {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true); // start TRUE
  const [error, setError] = useState(null);

  const { profile } = useAuth();
  // console.log(profile);

  useEffect(() => {
    if (!profile?.user_id) return; // wait until profile is ready

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
  }, [profile]); // re-runs when profile loads

  console.log(teamData);

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

  if (!teamData) return null; // belt-and-suspenders guard

  // check if there are leads contacted this month.
  // if no one, 0. else calculate
  const conversionRate =
    teamData.team_stats.team_kpis.leads > 0
      ? (
          (teamData.team_stats.team_kpis.bookings /
            teamData.team_stats.team_kpis.leads) *
          100
        ).toFixed(2)
      : 0;

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
          <LeaderCard
            agents={teamData.total_agents}
            calls={teamData.team_stats.team_kpis.calls}
            followUps={teamData.team_stats.team_kpis.followUps}
            bookings={teamData.team_stats.team_kpis.bookings}
            callsDeltaPct={teamData.team_stats.team_kpis.calls_change}
            bookingsDeltaPct={teamData.team_stats.team_kpis.bookings_change}
          />

          {/* 2. Team Performance*/}
          <PerformanceCard teamTable={teamData.team_overview} />

          {/* 3. Bottom Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="col-span-2 card  bg-base-100 ">
              <TeamConversionFunnel
                stages={[
                  {
                    label: 'Leads Contacted',
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

            {/* Total Regions */}

            <div className="col-span-2 card  bg-base-100">
              <LocationHeatmap locations={teamData.team_stats.team_regions} />
            </div>

            {/* Objections */}

            {/* <div className="col-span-1 card bg-base-100 ">
              <Objections objection={teamData.team_stats.team_objections} />
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default LeaderDashboard;

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
