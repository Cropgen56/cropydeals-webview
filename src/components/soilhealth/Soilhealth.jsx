import React from "react";
import { Rocket } from "lucide-react";

const SoilHealthReport = () => {
  return (
    <div className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[14px] font-bold text-emerald-900">Soil Health Report</h2>
        <button className="flex items-center gap-1 text-white bg-emerald-900 text-xs font-medium px-3 py-1.5 rounded-lg shadow-sm hover:bg-emerald-800 transition-all">
          <Rocket size={14} />
          <span className="text-[8px]">Start 3-Days <br />Free Trial</span>
        </button>
      </div>

      {/* Nutrient Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: "pH", value: "7.0 pH", desc: "Alkalinity" },
          { label: "P", value: "35 ppm", desc: "Phosphorus" },
          { label: "K", value: "180 ppm", desc: "potassium" },
          { label: "Mg", value: "110 ppm", desc: "Magnesium" },
          { label: "Ca", value: "1800 ppm", desc: "Calcium" },
          { label: "S", value: "25 ppm", desc: "Sulphur" },
        ].map((item, index) => (
          <div
            key={index}
            className="border border-emerald-900 rounded-xl p-3 text-center"
          >
            <h3 className="text-[16px] font-semibold text-emerald-900">{item.label}</h3>
            <p className="text-emerald-600 font-medium text-[12px]">{item.value}</p>
            <p className="text-gray-400 text-[10px] mt-0.5">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer Button */}
      <div className="bg-emerald-900 text-center rounded-xl py-2">
        <h3 className="text-white font-semibold text-sm">
          Get Report in ₹ 199
        </h3>
        <p className="text-white text-xs opacity-80 mt-1">Download Report</p>
      </div>
    </div>
  );
};

export default SoilHealthReport;
