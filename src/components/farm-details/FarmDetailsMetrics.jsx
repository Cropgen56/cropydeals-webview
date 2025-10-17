import React from "react";
import { useTranslation } from "react-i18next";

function FarmDetailsMetrics({ cropHealth }) {
    const { t } = useTranslation();

  const metrics = [
    { label: t("ndvi"), value: cropHealth?.data?.NDVI_Mean?.toFixed(2) || t("na") },
    { label: t("moisture"), value: cropHealth?.data?.Moisture || t("na") },
    { label: t("soc"), value: cropHealth?.data?.SOC || t("na") },
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
