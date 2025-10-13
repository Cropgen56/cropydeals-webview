import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { ArrowUp, ArrowDown } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

export default function FarmDetailsMarketPrice({ price = 2450, change = 50 }) {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 25, 30, 28, 35, 32, 40],
        borderColor: "#86D72F",
        backgroundColor: "transparent",
        pointBackgroundColor: "#86D72F",
        pointBorderColor: "#86D72F",
        pointRadius: 4,
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => tooltipItem.formattedValue,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#344E41", font: { size: 12 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#344E41", font: { size: 12 } },
        grid: { color: "#E5E7EB" },
      },
    },
  };

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-2">
      <h3 className="text-xl md:text-2xl font-bold text-[#075A53]">
        Market Prices
      </h3>

      <div className="flex justify-between items-center">
        <span className="text-base md:text-lg font-bold text-black">
          ₹{price.toLocaleString()} / Quintal
        </span>
        <span
          className={`text-base md:text-lg font-bold flex items-center gap-1 ${
            change >= 0 ? "text-[#86D72F]" : "text-red-500"
          }`}
        >
          {change >= 0 ? (
            <>
              <ArrowUp className="w-4 h-4" /> +₹{change}
            </>
          ) : (
            <>
              <ArrowDown className="w-4 h-4" /> -₹{Math.abs(change)}
            </>
          )}
        </span>
      </div>

      <div className="flex justify-between text-xs md:text-sm text-[#9A9898] font-medium">
        <span>Local Mandi</span>
        <span>Vs Last Week</span>
      </div>

      <div className="border border-[#D9D9D9] rounded-xl p-2 md:p-3 w-full h-80">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
