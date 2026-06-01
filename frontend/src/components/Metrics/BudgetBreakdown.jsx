import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  plugins,
} from "chart.js";
import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";

// Step 1 — Register the parts of Chart.js you are using
// Without this, the chart will not render at all
ChartJS.register(ArcElement, Tooltip, Legend);

function BudgetBreakdown() {
  // Step 3: Define your data and using useState & useEffect

  const [budgetData, setBudgetData] = useState([
    { cost: "RM 2.5k+", value: 0, color: "#1a3a7c" },
    { cost: "RM 1k-2.5k", value: 0, color: "#3b82f6" },
    { cost: "RM <1k", value: 0, color: "#d1d5db" },
  ]);

  useEffect(() => {
    const data = [
      { cost: "RM 2.5k+", value: 10, color: "#1a3a7c" },
      { cost: "RM 1k-2.5k", value: 32, color: "#3b82f6" },
      { cost: "RM <1k", value: 50, color: "#d1d5db" },
    ];

    setBudgetData(data);
  }, []);

  // Step 4: Define your data into the chart that you are going to use

  const chartPieAgent = {
    labels: budgetData.map((item) => item.cost),
    datasets: [
      {
        data: budgetData.map((item) => item.value),
        backgroundColor: budgetData.map((item) => item.color),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  // Step 5: Define your chart options

  const chartOptions = {
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: (item) => `${item.label}-${item.raw}%`,
        },
      },
      title: {
        display: true,
        text: "Lead Budget Breakdown",
      },
    },
  };

  // Step 6: Render using state data

  return (
    <div>
      <Doughnut data={chartPieAgent} options={chartOptions} />
    </div>
  );
}

export default BudgetBreakdown;
