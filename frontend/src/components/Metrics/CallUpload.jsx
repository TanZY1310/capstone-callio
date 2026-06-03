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
  ]);

  useEffect(() => {
    const data = [
      { day: "Monday", count: 10 },
      { day: "Tuesday", count: 20 },
      { day: "Wednesday", count: 10 },
      { day: "Thursday", count: 50 },
      { day: "Friday", count: 60 },
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
    maintainaspectratio: false,
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
    <div className="card">
      <Bar data={barChart} options={chartOptions} maintainAspectRatio:false />
    </div>
  );
}

export default CallUpload;
