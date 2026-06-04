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

function LeadsByRegion() {
  const [leadsRegion, setLeadsRegion] = useState([
    { district: "Bangsar", value: 0 },
    { district: "Cheras", value: 0 },
    { district: "Puchong", value: 0 },
    { district: "Kajang", value: 0 },
  ]);

  const [totalCall, setTotalCall] = useState(0);

  useEffect(() => {
    const data = [
      { district: "Bangsar", value: 40 },
      { district: "Cheras", value: 60 },
      { district: "Puchong", value: 20 },
      { district: "Kajang", value: 80 },
    ];

    const total = 200;
    setLeadsRegion(data);
    setTotalCall(total);
  }, []);

  // define your data into chart
  const chartBarAgent = {
    labels: leadsRegion.map((item) => item.district),
    datasets: [
      {
        data: leadsRegion.map((item) => item.value),
        backgroundColor: "#1a3a7c",
        borderRadius: 5,
      },
    ],
  };

  // define your chart styling
  const chartOptions = {
    maintainAspectRatio: false,
    indexAxis: "y", // this is the part that makes the chart horizontal
    scales: {
      x: { grid: { display: false } },

      y: { grid: { display: false } },
    },
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (item) => `${item.label} - ${item.raw}`,
        },
      },
    },
  };

  // Rendering

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm p-5">
      <h2 className="card-title text-base-content " style={{ padding: "5px" }}>
        Regions Team Breakdown
      </h2>

      <div>
        <Bar data={chartBarAgent} options={chartOptions} />
      </div>
    </div>
  );
}

export default LeadsByRegion;
