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

  useEffect(() => {
    const data = [
      { district: "Bangsar", value: 40 },
      { district: "Cheras", value: 100 },
      { district: "Puchong", value: 10 },
      { district: "Kajang", value: 200 },
    ];
    setLeadsRegion(data);
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
    indexAxis: "y", // this is the part that makes the chart horizontal
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
        text: "Leads By Region",
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

export default LeadsByRegion;
