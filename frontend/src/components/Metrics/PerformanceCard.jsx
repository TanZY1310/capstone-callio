import { useEffect, useState } from "react";

function PerformanceCard() {
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    setTeamData([
      { name: "Sarah Paulson", calls: 5, leads: 100, apps: 5, bookings: 50 },
      { name: "Miu Natasha", calls: 10, leads: 100, apps: 10, bookings: 50 },
      { name: "Lena Lalina", calls: 60, leads: 500, apps: 5, bookings: 50 },
    ]);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="text-base-content/60 text-xs uppercase">
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
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-10 w-10">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="avatar"
                      />
                    </div>
                  </div>
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
