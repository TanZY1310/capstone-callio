import { useEffect, useState } from "react";

function PerformanceCard() {
  const [teamData, setTeamData] = useState([]);

  //   const agents = [
  //     {
  //       name: "Sarah Paulson",
  //       calls: 5,
  //       leads: 100,
  //       apps: 5,
  //       bookings: 50,
  //     },
  //     {
  //       name: "Miu Natasha",
  //       calls: 10,
  //       leads: 100,
  //       apps: 10,
  //       bookings: 50,
  //     },
  //     {
  //       name: "Lena Lalina",
  //       calls: 60,
  //       leads: 500,
  //       apps: 5,
  //       bookings: 50,
  //     },
  //   ];

  useEffect(() => {
    const agents = [
      {
        name: "Sarah Paulson",
        calls: 5,
        leads: 100,
        apps: 5,
        bookings: 50,
      },
      {
        name: "Miu Natasha",
        calls: 10,
        leads: 100,
        apps: 10,
        bookings: 50,
      },
      {
        name: "Lena Lalina",
        calls: 60,
        leads: 500,
        apps: 5,
        bookings: 50,
      },
    ];

    setTeamData(agents);
  }, []);

  return (
    <div>
      <table
        className="table"
        style={{ background: "white" }}
        border="1"
        width="100"
      >
        <thead style={{ color: "grey" }}>
          <tr>
            <th style={{ color: "black" }}>Agent Name</th>
            <th style={{ color: "black" }}>Calls</th>
            <th style={{ color: "black" }}>Leads</th>
            <th style={{ color: "black" }}>Appointments</th>
            <th style={{ color: "black" }}>Bookings</th>
          </tr>
        </thead>
        <tbody>
          {teamData.map((agent, index) => (
            <tr key={index}>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt="avatar"
                      />
                    </div>
                  </div>
                  <div className="font-bold" style={{ color: "black" }}>
                    {agent.name}
                  </div>
                </div>
              </td>
              <td style={{ color: "black" }}>{agent.calls}</td>
              <td style={{ color: "black" }}>{agent.leads}</td>
              <td style={{ color: "black" }}>{agent.apps}</td>
              <td style={{ color: "black" }}>{agent.bookings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PerformanceCard;
