import { AlignRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

const status_label = {
  needs_attention: {
    label: 'Needs Attention',
    className: 'badge badge-sm badge-success',
  },
  follow_ups_needed: {
    label: 'Follow Up Needed',
    className: 'badge badge-sm badge-warning',
  },
  on_track: {
    label: 'On Track',
    className: 'badge badge-sm badge-success',
  },
  no_activity: {
    label: 'No Activity',
    className: 'badge badge-sm badge-info',
  },
};

function getRateClass(rate) {
  if (rate === null || rate === undefined)
    return 'bg-base-200 text-base-content/40';
  if (rate >= 50) return 'bg-green-100 text-green-800';
  if (rate >= 25) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

function PerformanceCard({ teamTable }) {
  // const [teamData, setTeamData] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
  });

  const filteredAgent = useMemo(() => {
    if (!teamTable) return [];

    let filtered = teamTable.filter((agent) => {
      const matchesAgent = agent.agent_name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      return matchesAgent;
    });

    return filtered;
  }, [filters, teamTable]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
    });
  };

  if (!teamTable) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body gap-4">
          <h2 className="card-title text-base-content">
            Agent Activity Summary
          </h2>
          <span> Loading... </span>
          {/* className="loading loading-spinner loading-md" */}
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-lg text-base-content">
            Agent Activity Summary
          </span>
          <label className="input input-sm">
            <CiSearch />
            <input
              type="search"
              className="grow"
              placeholder="Search here"
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
            />
          </label>
        </div>

        <table className="table w-full">
          <thead>
            {/* <tr className="text-base-content/60 text-xs uppercase bg-base-300">
              <th>No.</th>
              <th>Agent Name</th>

              <th>Calls This Month</th>
              <th>Appointment Rate</th>
              <th>Booking Rate</th>

              <th>Follow-Ups Pending</th>
              <th>Status</th>
            </tr> */}

            <tr
              className="text-xs uppercase"
              style={{
                background: 'linear-gradient(to right, #27324f, #27324f)',
              }}
            >
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">
                No.
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3">
                Agent Name
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Calls This Month
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Appointment Rate
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Booking Rate
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Follow-Ups Pending
              </th>
              <th className="text-indigo-100 font-medium tracking-wider py-3 px-3 text-center">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredAgent.map((agent, index) => (
              <tr key={agent.agent_id} className="hover">
                <td className="text-base-content/70">{index + 1}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-base-content">
                      {agent.agent_name}
                    </span>
                  </div>
                </td>

                <td className="text-base-content text-center">{agent.calls}</td>
                {/* <td className="text-base-content text-center">
                  {agent.appointment_rate}
                </td>

                <td className="text-base-content text-center">
                  {agent.booking_rate}
                </td> */}

                <td className="text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.appointment_rate)}`}
                  >
                    {agent.appointment_rate != null
                      ? `${agent.appointment_rate}%`
                      : '—'}
                  </span>
                </td>

                <td className="text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getRateClass(agent.booking_rate)}`}
                  >
                    {agent.booking_rate != null
                      ? `${agent.booking_rate}%`
                      : '—'}
                  </span>
                </td>

                <td className="text-base-content text-center">
                  {agent.followUps}
                </td>

                <td className="text-base-content text-center">
                  {(() => {
                    const config =
                      status_label[agent.status] ?? status_label['no_activity'];
                    return (
                      <span className={config.className}>{config.label}</span>
                    );
                  })()}
                  {/* {agent.status} */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceCard;
