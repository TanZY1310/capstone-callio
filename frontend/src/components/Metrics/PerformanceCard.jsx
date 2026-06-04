import { AlignRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";

function PerformanceCard({ dummyAgentPerformance }) {
  // const [teamData, setTeamData] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: "",
  });

  const filteredAgent = useMemo(() => {
    let filtered = dummyAgentPerformance.filter((agent) => {
      const matchesAgent = agent.name
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      return matchesAgent;
    });

    return filtered;
  }, [filters, dummyAgentPerformance]);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
    });
  };

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
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
          />
        </label>

        <table className="table table-zebra w-full">
          <thead>
            <tr className="text-base-content/60 text-xs uppercase">
              <th>ID</th>
              <th>Agent Name</th>
              <th>Calls</th>
              <th>Leads</th>
              <th>Appointments</th>
              <th>Bookings</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgent.map((agent, index) => (
              <tr key={index} className="hover">
                <td className="text-base-content/70">{agent.id}</td>

                <td>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-base-content">
                      {agent.name}
                    </span>
                  </div>
                </td>

                <td className="text-base-content/70">{agent.calls}</td>
                <td className="text-base-content/70">{agent.leads}</td>
                <td className="text-base-content/70">{agent.apps}</td>
                <td className="text-base-content/70">{agent.bookings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PerformanceCard;
