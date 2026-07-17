import { AlignRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

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
            <tr className="text-base-content/60 text-xs uppercase bg-base-300">
              <th>No.</th>
              <th>Agent Name</th>
              <th>Leads</th>

              <th>Calls</th>

              <th>Follow-Ups</th>
              <th>Appointments</th>
              <th>Conversion</th>
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
                <td className="text-base-content/70">{agent.leads}</td>

                <td className="text-base-content/70">{agent.calls}</td>
                <td className="text-base-content/70">{agent.followUps}</td>
                <td className="text-base-content/70">{agent.appointments}</td>

                <td className="text-base-content/70">{agent.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceCard;
