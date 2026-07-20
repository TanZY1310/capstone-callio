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
import api from '../../utils/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

function CallUpload({ calls, error, period, year, month, day }) {
  const today = new Date();

  console.log(calls);

  if (!calls) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Call Volume</h2>
          <p className="text-xs text-base-content/50">No data available</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Daily Call Volume</h2>
          <p className="text-xs text-error">{error}</p>
        </div>
      </div>
    );
  }

  const MONTH_NAMES = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  let filledData = [];

  // Setting up the labels for each period

  if (period == 'daily') {
    const activeYear = year ?? today.getFullYear();
    const activeMonth = month ?? today.getMonth() + 1;
    const countsByDate = {};

    calls.forEach((item) => {
      countsByDate[item.call_date] = item.call_count;
    });

    const lastDay = new Date(activeYear, activeMonth, 0).getDate();
    // get Day 0 of the next month
    // getDate() -> nak dapatkan haribulan sahaja

    filledData = Array.from({ length: lastDay }, (_, index) => {
      const day = new Date(activeYear, activeMonth - 1, index + 1);
      // activeMonth - 1 because in JS, month start at 0 (January)
      const dateString = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;

      return {
        call_date: dateString,
        call_count: countsByDate[dateString] || 0,
      };
    });
  } else if (period == 'monthly') {
    const countsByMonths = {};

    calls.forEach((item) => {
      countsByMonths[item.call_date] = item.call_count;
    });

    filledData = Array.from({ length: 12 }, (_, index) => ({
      call_date: MONTH_NAMES[index],
      call_count: countsByMonths[index + 1] || 0,
    }));
  }

  // defining data into chart
  const lineChart = {
    labels: filledData.map((item) => item.call_date),
    datasets: [
      {
        label: 'Total Calls',
        data: filledData.map((item) => item.call_count),
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
      x: { grid: { display: false }, ticks: { maxRotation: 0 } },
      y: { grid: { display: false }, min: 0, ticks: { display: false } },
    },

    responsive: true,
    plugins: {
      legend: { position: 'top', display: false },
      tooltip: {
        callbacks: {
          label: (item) => ` ${item.raw}`,
        },
      },
    },
  };

  const periodLabel = {
    // This code creates a label text depending on the selected time period (daily, monthly, or yearly)
    daily: `${day ?? today.getDate()} ${MONTH_NAMES[(month ?? today.getMonth() + 1) - 1]} ${year ?? today.getFullYear()}`,
    monthly: `${MONTH_NAMES[(month ?? today.getMonth() + 1) - 1]} ${year ?? today.getFullYear()}`,
    // yearly: `${year ?? today.getFullYear()}`,
  }[period];

  // rendering
  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-base-content">Call Volume</h2>

        <p className="text-xs text-base-content/50">{periodLabel}</p>

        <div style={{ height: '300px' }}>
          <Line data={lineChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default CallUpload;
