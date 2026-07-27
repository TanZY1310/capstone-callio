import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { MdWidthFull } from 'react-icons/md';

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

function LeadsByRegion({ regions }) {
  if (!regions || regions.length === 0) {
    return (
      <div className="card bg-base-100  p-6">
        <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
          Regions Breakdown
        </h2>

        <p className="text-base-content/60 text-sm " style={{ padding: '5px' }}>
          No regions logged yet.
        </p>
      </div>
    );
  }

  // console.log(regions);

  // define your data into chart
  const chartBarAgent = {
    labels: regions.map((item) => item.region),
    datasets: [
      {
        data: regions.map((item) => item.region_count),
        backgroundColor: '#1a3a7c',
        borderRadius: 5,
      },
    ],
  };

  // define your chart styling
  const chartOptions = {
    maintainAspectRatio: false,
    indexAxis: 'y', // this is the part that makes the chart horizontal
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },

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
          label: (item) => ` ${item.raw}`,
        },
      },
    },
  };

  // Rendering

  return (
    // <div className="card bg-base-100 border border-base-200 shadow-sm p-6">
    <div className="card bg-base-100  p-6">
      <h2 className="card-title text-base-content" style={{ padding: '5px' }}>
        Regions Breakdown
      </h2>

      <div style={{ height: '200px' }}>
        <Bar data={chartBarAgent} options={chartOptions} />
      </div>
    </div>
  );
}

export default LeadsByRegion;

///////////////////////////////////////////////////////////////////
///////////////////// NOT IMPORTANT ///////////////////////////////
///////////////////////////////////////////////////////////////////

// const [leadsRegion, setLeadsRegion] = useState([]);
// const [totalCall, setTotalCall] = useState(0);

// useEffect(() => {
//   const data = [
//     { district: "Bangsar", value: 40 },
//     { district: "Cheras", value: 60 },
//     { district: "Puchong", value: 20 },
//     { district: "Kajang", value: 80 },
//     { district: "KL City", value: 10 },
//   ];

//   const total = 200;
//   setLeadsRegion(data);
//   setTotalCall(total);
// }, []);
