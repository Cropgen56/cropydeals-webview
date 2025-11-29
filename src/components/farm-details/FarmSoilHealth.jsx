import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import NutrientBar from "./NutrientBar";
import FertilizerRecommendation from "./fertilizerRecommendation";
import { useTranslation } from "react-i18next";

const NUTRIENT_CONFIG = [
  { symbol: "N", label: "nitrogen", key: "nitrogenKgPerHa" },
  { symbol: "P", label: "phosphorous", key: "phosphorousKgPerHa" },
  { symbol: "K", label: "potassium", key: "potassiumKgPerHa" },
];

const FarmDetailsSoilHealth = () => {
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

  const nutrientData = useMemo(
    () =>
      NUTRIENT_CONFIG.map((n) => ({
        symbol: n.symbol,
        label: t(n.label),
        current: npkData.available[n.key] || 0,
        required: npkData.required[n.key] || 0,
      })),
    [npkData, t]
  );

  return (
    <section className="bg-white rounded-xl border border-[#E6EEF0] md:px-8 p-4 flex flex-col gap-4">
      <h2 className="text-base sm:text-xl font-bold text-[#075A53]">
        {t("soilHealth")}
      </h2>

      <div className="flex justify-end gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[#36A534]" />
          <span>{t("current")}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3.5 h-3.5 rounded bg-[#C4E930]" />
          <span>{t("required")}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {nutrientData.map((n) => (
          <NutrientBar
            key={n.symbol}
            symbol={n.symbol}
            label={n.label}
            current={n.current}
            required={n.required}
          />
        ))}
      </div>

      <FertilizerRecommendation
      />

      <div className="bg-[#F8F8F8] border border-[#D9D9D9] rounded-xl p-3 text-sm text-[#344E41] font-medium">
        {npkData.recommendation || t("noAdditionalFertilizer")}
      </div>
    </section>
  );
};

export default FarmDetailsSoilHealth;
