// import { useEffect, useState, useRef } from 'react';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import api from '../../utils/api.js';
// import axios from 'axios';
// import { useAuth } from '../../hooks/useAuth.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// );

// const MONTH_NAMES = [
//   'January',
//   'February',
//   'March',
//   'April',
//   'May',
//   'June',
//   'July',
//   'August',
//   'September',
//   'October',
//   'November',
//   'December',
// ];

// function DailyCallPoint() {
//   const today = new Date(); // get today date

//   const [year, setYear] = useState(today.getFullYear());
//   const [month, setMonth] = useState(today.getMonth() + 1); // JS month index start with 0
//   const [dailyCalls, setDailyCalls] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);

//   const API_URL = 'http://localhost:8000';
//   const { profile } = useAuth();

//   // bounded option list for dropdown button (month and year)
//   const availableYear = [today.getFullYear() - 1, today.getFullYear()];
//   const availableMonth = MONTH_NAMES.map((month, index) => ({
//     label: month,
//     value: index + 1,
//   }));

//   const fetchDailyCalls = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(
//         `/dashboard/agent/daily-calls/${profile.user_id}?year=${year}&month=${month}`,
//       );

//       setDailyCalls(response.data);
//     } catch (error) {
//       setError(error);
//       console.error('Error fetching books:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     setError(false);

//     // if (!profile?.user_id) return; // If profile exists, get user_id.
//     // Otherwise, return undefined instead of throwing an error."

//     fetchDailyCalls();
//   }, [year, month]);

//   console.log(dailyCalls);

//   // This part is for button dropdown
//   // refs to programmatically close the dropdown after a selection
//   const monthDropdownRef = useRef(null);
//   const yearDropdownRef = useRef(null);

//   const handleMonthSelect = (selectedMonth) => {
//     setMonth(selectedMonth);
//     // closeDropdown(monthDropdownRef);
//   };

//   const handleYearSelect = (selectedYear) => {
//     setYear(selectedYear);
//     // closeDropdown(yearDropdownRef);
//   };

//   if (loading) {
//     return (
//       <div className="card bg-base-100 border border-base-200 shadow-sm">
//         <div className="card-body">
//           <h2 className="card-title text-base-content">Daily Call Volume</h2>
//           <p className="text-xs text-base-content/50">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="card bg-base-100 border border-base-200 shadow-sm">
//         <div className="card-body">
//           <h2 className="card-title text-base-content">Daily Call Volume</h2>
//           <p className="text-xs text-error">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const countsByDate = {}; // set an empty dictionary

//   dailyCalls.forEach((item) => {
//     // insert the fetched daily calls data into the dict
//     countsByDate[item.call_date] = item.call_count;
//   });

//   // JavaScript months are zero-indexed. January is 0
//   // The indexing start at 0

//   const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
//   // TAKE NOTE!! day: 0 is a special JavaScript quirk: instead of erroring,
//   // it rolls backward to the last day of the previous month relative to whatever monthIndex you gave it.

//   const allDatesThisMonth = []; // set an empty array

//   // create the dates of each month in the array

//   for (let day = 1; day <= lastDayOfMonth; day++) {
//     const d = new Date(year, month, day);
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, '0');
//     const dd = String(d.getDate()).padStart(2, '0');
//     allDatesThisMonth.push(`${yyyy}-${mm}-${dd}`); // push the dates into the array
//   }

//   const filledData = allDatesThisMonth.map((dateStr) => ({
//     call_date: dateStr,
//     call_count: countsByDate[dateStr] || 0,
//   }));

//   // defining data into chart
//   const lineChart = {
//     labels: filledData.map((item) => item.call_date),
//     datasets: [
//       {
//         label: 'Total Calls Today',
//         data: filledData.map((item) => item.call_count),
//         backgroundColor: '#1a3a7c',
//         borderColor: '#1a3a7c',
//         // borderRadius: 5,
//       },
//     ],
//   };

//   // defining chart styling
//   const chartOptions = {
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         grid: { display: false },
//         ticks: {
//           autoSkip: false,
//           callback: function (value, index, ticks) {
//             const date = this.getLabelForValue(value);
//             const day = parseInt(date.split('-')[2], 10);
//             // show only 1st, 8th, 15th, 22nd, end of month (roughly weekly/quarter-month marks)
//             if (
//               day === 1 ||
//               day === 8 ||
//               day === 15 ||
//               day === 22 ||
//               index === ticks.length - 1
//             ) {
//               return date.slice(5); // "MM-DD", drop the year for compactness
//             }
//             return null; // null = skip rendering this label, point still exists
//           },
//           maxRotation: 0,
//         },
//       },
//       y: { grid: { display: false }, min: 0, ticks: { display: false } },
//     },

//     responsive: true,
//     plugins: {
//       legend: { position: 'top', display: false },
//       tooltip: {
//         callbacks: {
//           label: (item) => ` ${item.raw}`,
//         },
//       },
//     },
//   };

//   // rendering
//   return (
//     <div className="card bg-base-100 border border-base-200 shadow-sm">
//       <div className="card-body">
//         <h2 className="card-title text-base-content">Daily Call Volume</h2>
//         <p>
//           {MONTH_NAMES[month - 1]} {year}
//         </p>
//         <p className="text-xs text-base-content/50">This Month</p>

//         {/* This is the dropdown button configured */}
//         <div className="flex gap-2">
//           <div className="dropdown">
//             <div
//               tabIndex={0}
//               role="button"
//               className="btn m-1"
//               ref={monthDropdownRef}
//             >
//               {MONTH_NAMES[month - 1]}
//             </div>
//             <ul
//               tabIndex={0}
//               className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
//             >
//               {MONTH_NAMES.map((month, index) => {
//                 <li key={index + 1}>
//                   <button
//                     className={month === index + 1 ? 'active' : ''}
//                     onClick={() => handleMonthSelect(index + 1)}
//                   >
//                     {' '}
//                     {month}
//                   </button>
//                 </li>;
//               })}
//             </ul>
//           </div>

//           <div className="dropdown">
//             <div
//               tabIndex={0}
//               role="button"
//               className="btn m-1"
//               ref={yearDropdownRef}
//             >
//               {year}
//             </div>
//             <ul
//               tabIndex={0}
//               className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
//             >
//               {availableYear.map((year) => {
//                 <li key={year}>
//                   <button
//                     className={y === y ? 'active' : ''}
//                     onClick={() => handleYearSelect(y)}
//                   >
//                     {' '}
//                     {y}
//                   </button>
//                 </li>;
//               })}
//             </ul>
//           </div>
//         </div>

//         <div style={{ height: '300px' }}>
//           <Line data={lineChart} options={chartOptions} />
//         </div>
//       </div>
//     </div>
//   );
// }

// // dropdown button code
// {
//   /* <div className="dropdown flex justify-end">
//   <div tabIndex={0} role="button" className="btn m-1">Click</div>
//   <ul tabIndex="-1" className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
//     <li><a>Item 1</a></li>
//     <li><a>Item 2</a></li>
//   </ul>
// </div> */
// }

// export default DailyCallPoint;

// ///////////////////////////////////////////////////////////////////
// ///////////////////// NOT IMPORTANT ///////////////////////////////
// ///////////////////////////////////////////////////////////////////

// // const [call, setCall] = useState([
// //     { day: 'Monday', count: 0 },
// //     { day: 'Tuesday', count: 0 },
// //     { day: 'Wednesday', count: 0 },
// //     { day: 'Thursday', count: 0 },
// //     { day: 'Friday', count: 0 },
// //     { day: 'Saturday', count: 0 },
// //     { day: 'Sunday', count: 0 },
// //   ]);

// //   useEffect(() => {
// //     const data = [
// //       { day: 'Monday', count: 10 },
// //       { day: 'Tuesday', count: 20 },
// //       { day: 'Wednesday', count: 10 },
// //       { day: 'Thursday', count: 50 },
// //       { day: 'Friday', count: 60 },
// //       { day: 'Saturday', count: 60 },
// //       { day: 'Sunday', count: 20 },
// //     ];
// //     setCall(data);
// //   }, []);

import { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

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

function DailyCallPoint({
  dailyCalls,
  loading,
  error,
  year,
  month,
  onYearChange,
  onMonthChange,
}) {
  const today = new Date();
  const availableYear = [today.getFullYear() - 1, today.getFullYear()];

  const monthDropdownRef = useRef(null);
  const yearDropdownRef = useRef(null);

  if (loading) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Daily Call Volume</h2>
          <p className="text-xs text-base-content/50">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Daily Call Volume</h2>
          <p className="text-xs text-error">{String(error)}</p>
        </div>
      </div>
    );
  }

  if (!dailyCalls) {
    return (
      <div className="card bg-base-100 border border-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-base-content">Daily Call Volume</h2>
          <p className="text-xs text-base-content/50">No data yet.</p>
        </div>
      </div>
    );
  }

  const countsByDate = {};
  dailyCalls.forEach((item) => {
    countsByDate[item.call_date] = item.call_count;
  });

  const lastDayOfMonth = new Date(year, month, 0).getDate();

  const allDatesThisMonth = [];
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const d = new Date(year, month - 1, day);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    allDatesThisMonth.push(`${yyyy}-${mm}-${dd}`);
  }

  const filledData = allDatesThisMonth.map((dateStr) => ({
    call_date: dateStr,
    call_count: countsByDate[dateStr] || 0,
  }));

  const lineChart = {
    labels: filledData.map((item) => item.call_date),
    datasets: [
      {
        fill: true,
        label: 'Total Calls Today',
        data: filledData.map((item) => item.call_count),
        backgroundColor: 'rgba(131, 188, 227, 0.5)',
        borderColor: '#1a3a7c',
        pointRadius: 2, // <-- add this
        pointHoverRadius: 4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          autoSkip: false,
          callback: function (value, index, ticks) {
            const date = this.getLabelForValue(value);
            const day = parseInt(date.split('-')[2], 10);
            if (
              day === 1 ||
              day === 8 ||
              day === 15 ||
              day === 22 ||
              index === ticks.length - 1
            ) {
              return date.slice(5);
            }
            return null;
          },
          maxRotation: 0,
        },
      },
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

  return (
    <div className="card bg-base-100 border border-base-200 shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base-content">Daily Call Volume </h2>

          {/* <p className="text-xs text-base-content/50"> This Month</p> */}

          <div className="flex gap-2">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 text-s text-content/50"
                ref={monthDropdownRef}
              >
                {MONTH_NAMES[month - 1]}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm "
              >
                {MONTH_NAMES.map((m, index) => (
                  <li key={index + 1}>
                    <button
                      className={month === index + 1 ? 'active' : ''}
                      onClick={() => onMonthChange(index + 1)}
                    >
                      {' '}
                      {m}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn m-1 text-s text-content/50"
                ref={yearDropdownRef}
              >
                {year}
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {availableYear.map((y) => (
                  <li key={y}>
                    <button
                      className={year === y ? 'active' : ''}
                      onClick={() => onYearChange(y)}
                    >
                      {' '}
                      {y}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div style={{ height: '300px' }}>
          <Line data={lineChart} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

export default DailyCallPoint;
