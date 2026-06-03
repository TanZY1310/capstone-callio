import { useEffect, useState } from "react";
import { data } from "react-router-dom";

function PerformanceCard() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Sarah Paulson",
        calls: 5,
        leads: 150,
        apps: 5,
        bookings: 5,
      },
      {
        id: 2,
        name: "Miu Natasha",
        calls: 10,
        leads: 100,
        apps: 10,
        bookings: 1,
      },
      {
        id: 3,
        name: "Lena Lalina",
        calls: 60,
        leads: 80,
        apps: 5,
        bookings: 3,
      },
      {
        id: 4,
        name: "Alexis Putellas",
        calls: 20,
        leads: 100,
        apps: 10,
        bookings: 9,
      },
      {
        id: 5,
        name: "Callum Turner",
        calls: 10,
        leads: 500,
        apps: 5,
        bookings: 3,
      },
    ];

    setTeamData(data);
  }, []);

  return (
    <div className="overflow-x-auto">
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
          {teamData.map((agent, index) => (
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
  );
}

export default PerformanceCard;
