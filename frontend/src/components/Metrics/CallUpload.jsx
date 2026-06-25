import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function CallUpload({ daily_calls }) {
  // if there is no data available yet

  if (!daily_calls) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Daily Call Volume</h2>
          <p className="text-xs text-base-content/50">This month</p>
        </div>
      </div>
    );
  }

  const countsByDate = {};
  daily_calls.forEach((item) => {
    countsByDate[item.call_date] = item.call_count;
  });

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // JavaScript months are zero-indexed. January is 0
  // The indexing start at 0

  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  // But day: 0 is a special JavaScript quirk: instead of erroring,
  // it rolls backward to the last day of the previous month relative to whatever monthIndex you gave it.

  const allDatesThisMonth = [];
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const d = new Date(year, month, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    allDatesThisMonth.push(`${yyyy}-${mm}-${dd}`);
  }

  const filledData = allDatesThisMonth.map((dateStr) => ({
    call_date: dateStr,
    call_count: countsByDate[dateStr] || 0,
  }));

  // defining data into chart
  const lineChart = {
    labels: filledData.map((item) => item.call_date),
    datasets: [
      {
        label: 'Total Calls Today',
        data: call.map((item) => item.call_count),
        backgroundColor: '#1a3a7c',
        borderColor: '#1a3a7c',
        // borderRadius: 5,
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

    responsive: true,
    plugins: {
      legend: { position: 'top', display: false },
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
        <h2 className="card-title text-base-content">Daily Call Volume</h2>
        <p className="text-xs text-base-content/50">This Month</p>
        <div style={{ height: '300px' }}>
          <Line data={lineChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default CallUpload;

///////////////////////////////////////////////////////////////////
///////////////////// NOT IMPORTANT ///////////////////////////////
///////////////////////////////////////////////////////////////////

// const [call, setCall] = useState([
//     { day: 'Monday', count: 0 },
//     { day: 'Tuesday', count: 0 },
//     { day: 'Wednesday', count: 0 },
//     { day: 'Thursday', count: 0 },
//     { day: 'Friday', count: 0 },
//     { day: 'Saturday', count: 0 },
//     { day: 'Sunday', count: 0 },
//   ]);

//   useEffect(() => {
//     const data = [
//       { day: 'Monday', count: 10 },
//       { day: 'Tuesday', count: 20 },
//       { day: 'Wednesday', count: 10 },
//       { day: 'Thursday', count: 50 },
//       { day: 'Friday', count: 60 },
//       { day: 'Saturday', count: 60 },
//       { day: 'Sunday', count: 20 },
//     ];
//     setCall(data);
//   }, []);
