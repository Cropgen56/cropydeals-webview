import React from "react";

const NutrientBar = ({ label, symbol, current = 0, required = 0 }) => {
  const max = Math.max(current, required, 1);
  const currentPct = Math.min(Math.round((current / max) * 100), 100);
  const requiredPct = Math.min(Math.round((required / max) * 100), 100);

  const ratio = required === 0 ? 1 : current / required;
  let computedColor = "#36A534";
  if (ratio < 0.5) computedColor = "#EC1C24";
  else if (ratio < 0.9) computedColor = "#FCC21B";

  return (
    <div className="flex items-center gap-4">
      {/* Symbol Badge */}
      <div className="flex-none w-12 h-12 rounded-full bg-[#86D72F] flex items-center justify-center">
        <span className="text-white font-bold">{symbol}</span>
      </div>

      {/* Bars */}
      <div className="flex-1 flex flex-col gap-1">
        <span className="font-bold text-sm text-black">{label}</span>

        <div className="relative w-full h-2 rounded bg-[#EDF7E6]">
          <div
            className="h-full rounded"
            style={{ width: `${currentPct}%`, backgroundColor: computedColor }}
          />
        </div>

        <div className="relative w-full h-2 rounded bg-[#E6F7C6]">
          <div
            className="h-full rounded"
            style={{ width: `${requiredPct}%`, backgroundColor: "#C4E930" }}
          />
        </div>
      </div>

      {/* Values */}
      <div className="flex-none w-24 text-right flex flex-col gap-0.5">
        <span className="font-bold text-xs text-[#1B5E20]">{Math.round(current)} kg/acre</span>
        <span className="text-xs text-[#9AA6A3]">{Math.round(required)} kg/acre</span>
      </div>
    </div>
  );
};

export default NutrientBar;
