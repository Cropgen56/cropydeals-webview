import React from "react";
import NutrientBar from "./NutrientBar";
import FertilizerRecommendation from "./fertilizerRecommendation";

const MOCK_NUTRIENTS = [
    { symbol: "N", label: "Nitrogen", current: 30, required: 40 },
    { symbol: "P", label: "Phosphorous", current: 10, required: 30 },
    { symbol: "K", label: "Potassium", current: 20, required: 20 },
];

const MOCK_FERT_PLAN = {
    urea_kg: 20,
    dap_kg: 15,
    mop_kg: 20,
};

const FarmDetailsSoilHealth = () => {
    return (
        <section className="bg-white rounded-xl border border-[#E6EEF0] md:px-8 p-4 flex flex-col gap-4">
            <h2 className="text-base sm:text-xl font-bold text-[#075A53]">
                Soil Heath
            </h2>

            <div className="flex justify-end gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded bg-[#36A534]" />
                    <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 rounded bg-[#C4E930]" />
                    <span>Required</span>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {MOCK_NUTRIENTS.map((n) => (
                    <NutrientBar
                        key={n.symbol}
                        symbol={n.symbol}
                        label={n.label}
                        current={n.current}
                        required={n.required}
                    />
                ))}
            </div>

            <FertilizerRecommendation fertilizerPlan={MOCK_FERT_PLAN} />

            <div className="bg-[#F8F8F8] border border-[#D9D9D9] rounded-xl p-3 text-sm text-[#344E41] font-medium">
                No additional fertilizer needed now.
            </div>
        </section>
    );
};

export default FarmDetailsSoilHealth;
