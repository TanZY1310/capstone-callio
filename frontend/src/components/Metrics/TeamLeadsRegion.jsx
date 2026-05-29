import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

// Step 1 — Register the parts of Chart.js you are using
// Without this, the chart will not render at all
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

function TeamLeadsRegion() {
  const [teamRegion, setTeamRegion] = useState([]);

  useEffect(() => {
    const data = [
      { district: "Bangsar", value: 40 },
      { district: "Cheras", value: 100 },
      { district: "Puchong", value: 10 },
      { district: "Kajang", value: 200 },
    ];
    setTeamRegion(data);
  }, []);

  // define your data into chart
  const chartBarAgent = {
    labels: teamRegion.map((item) => item.district),
    datasets: [
      {
        data: teamRegion.map((item) => item.value),
        backgroundColor: "#1a3a7c",
        borderRadius: 5,
      },
    ],
  };

  // define your chart styling
  const chartOptions = {
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (item) => `${item.label} - ${item.raw}%`,
        },
      },

      title: {
        display: true,
        text: "Team Leads By Region",
      },
    },
  };

  // Rendering

  return (
    <div>
      <Bar data={chartBarAgent} options={chartOptions} />
    </div>
  );
}

export default TeamLeadsRegion;
