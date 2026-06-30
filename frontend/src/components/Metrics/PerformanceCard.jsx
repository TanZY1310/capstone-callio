import { AlignRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CiSearch } from 'react-icons/ci';

// team_overview
// :
// Array(2)
// 0
// :
// {agent_id: '70567514-7d24-4a44-b9f1-430df27475bc', agent_name: 'Hannah John', total_calls: 0, total_leads: 9, follow_ups: 0, …}
// 1
// :
// {agent_id: '6ae4719d-b68c-41c4-b8fb-8dcd010fd329', agent_name: 'Sarah Yasmin', total_calls: 0, total_leads: 5, follow_ups: 0, …}
// length
// :
// 2
// [[Prototype]]
// :
// Array(0)
// team_stats
// :
// {team_kpis: {…}, team_regions: Array(4), team_objections: Array(0)}
// total_agents
// :
// 2

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
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body gap-4">
        <h2 className="card-title text-base-content">Agent Activity Summary</h2>
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

        <table className="table w-full">
          <thead>
            <tr className="text-base-content/60 text-xs uppercase bg-base-300">
              <th>No.</th>
              <th>Agent Name</th>
              <th>Calls</th>
              <th>Leads</th>
              <th>Follow-Ups</th>
              <th>Appointments</th>
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

                <td className="text-base-content/70">{agent.total_calls}</td>
                <td className="text-base-content/70">{agent.total_leads}</td>
                <td className="text-base-content/70">{agent.follow_ups}</td>
                <td className="text-base-content/70">{agent.appointments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceCard;
