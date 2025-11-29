
import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector, shallowEqual } from "react-redux";

const FERT_ITEMS = [
  { key: "urea_kg", symbol: "N", color: "#FCC21B", name: "urea", desc: "nitrogen" },
  { key: "dap_kg", symbol: "P", color: "#EC1C24", name: "dap", desc: "phosphorous" },
  { key: "mop_kg", symbol: "K", color: "#36A534", name: "mop", desc: "potassium" },
];

const FertilizerRecommendation = () => {
  const { t } = useTranslation();
  const advisory = useSelector(
    (state) => state.smartAdvisory.advisory,
    shallowEqual
  );

  const npkData = advisory?.npkManagement || {
    available: { nitrogenKgPerHa: 0, phosphorousKgPerHa: 0, potassiumKgPerHa: 0 },
    required: { nitrogenKgPerHa: 0, phosphorousKgPerHa: 0, potassiumKgPerHa: 0 },
    recommendation: "",
  };

  const symbolToKeyMap = {
    N: "nitrogenKgPerHa",
    P: "phosphorousKgPerHa",
    K: "potassiumKgPerHa",
  };

  const getPercentage = (current, required) => {
    if (!required || required === 0) return 0;
    return Math.round((current / required) * 100);
  };

  return (
    <div className="flex flex-col gap-3 mt-4">
      <h3 className="font-bold text-[#0E4D44] text-sm md:text-base">
        {t("fertilizerRequirement")}
      </h3>

      {FERT_ITEMS.map((item) => {
        const required = npkData.required[symbolToKeyMap[item.symbol]] || 0;
        const available = npkData.available[symbolToKeyMap[item.symbol]] || 0;
        const percentage = getPercentage(available, required);

        return (
          <div
            key={item.key}
            className="flex items-center gap-3 border rounded-xl p-3 border-l-4 border-[#D9D9D9]"
          >
            <div
              className="flex-none w-12 h-12 rounded flex items-center justify-center"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-white font-bold text-lg md:text-xl">
                {item.symbol}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-0.5">
              <span className="font-semibold text-sm md:text-base text-black">
                {t(item.name)}
              </span>
              <span className="text-xs text-black font-medium">
                {t(item.desc)} ({percentage}%)
              </span>
            </div>

            <div className="flex-none font-bold text-base md:text-xl text-black">
              {available} kg
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FertilizerRecommendation;
