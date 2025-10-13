import React from "react";

const SoilMoistureTemp = ({ moisture = "25%", temperature = "22°C" }) => {
  return (
    <div className="flex justify-between mb-4 bg-[#F5FAFB] border border-[#E1EEF0] rounded p-4">
      <div>
        <span className="text-[#075A53] font-bold text-sm">Soil Moisture</span>
        <div className="text-black text-sm">{moisture}</div>
      </div>
      <div>
        <span className="text-[#075A53] font-bold text-sm">Soil Temperature</span>
        <div className="text-black text-sm">{temperature}</div>
      </div>
    </div>
  );
};

export default SoilMoistureTemp;
