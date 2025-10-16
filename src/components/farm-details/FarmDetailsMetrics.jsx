import React from "react";

function FarmDetailsMetrics({ cropHealth }) {
  const metrics = [
    { label: "NDVI", value: cropHealth?.data?.NDVI_Mean?.toFixed(2) || "N/A" },
    { label: "Moisture", value: cropHealth?.data?.Moisture || "N/A" },
    { label: "SOC", value: cropHealth?.data?.SOC || "N/A" },
  ];

  return (
    <div className="flex justify-between gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`flex-1 flex flex-col items-center justify-between py-2 px-3 ${
            index !== metrics.length - 1 ? "border-r border-[#D9D9D9]" : ""
          }`}
        >
          <span className="text-[#9A9898] font-semibold text-xs md:text-base">
            {metric.label}
          </span>
          <span className="text-black font-bold text-base md:text-xl">
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default FarmDetailsMetrics;
