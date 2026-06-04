import { useEffect, useState } from "react";
import { Chart as ChartJS, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, Title, Tooltip, Legend);

function CallUpload() {
  const [call, setCall] = useState([
    { day: "Monday", count: 0 },
    { day: "Tuesday", count: 0 },
    { day: "Wednesday", count: 0 },
    { day: "Thursday", count: 0 },
    { day: "Friday", count: 0 },
    { day: "Saturday", count: 0 },
    { day: "Sunday", count: 0 },
  ]);

  useEffect(() => {
    const data = [
      { day: "Monday", count: 10 },
      { day: "Tuesday", count: 20 },
      { day: "Wednesday", count: 10 },
      { day: "Thursday", count: 50 },
      { day: "Friday", count: 60 },
      { day: "Saturday", count: 60 },
      { day: "Sunday", count: 20 },
    ];
    setCall(data);
  }, []);

  // defining data into chart
  const barChart = {
    labels: call.map((item) => item.day),
    datasets: [
      {
        label: "Calls Updated",
        data: call.map((item) => item.count),
        backgroundColor: "#1a3a7c",
        borderRadius: 5,
      },
    ],
  };

  // defining chart styling
  const chartOptions = {
    maintainAspectRatio: false,
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
      legend: { position: "top", display: false },
      tooltip: {
        callbacks: {
          label: (item) => `${item.label} - ${item.raw}`,
        },
      },
    },
  };

  // rendering
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-base-content">Weekly Call Volume</h2>
        <p className="text-xs text-base-content/50">
          Monday - Friday (Current Week)
        </p>
        <div style={{ height: "300px" }}>
          <Bar data={barChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default CallUpload;
