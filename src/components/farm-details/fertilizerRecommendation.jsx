import React from "react";

const FERT_ITEMS = [
    { key: "urea_kg", symbol: "N", color: "#FCC21B", name: "Urea", desc: "Nitrogen" },
    { key: "dap_kg", symbol: "P", color: "#EC1C24", name: "DAP", desc: "Phosphorous" },
    { key: "mop_kg", symbol: "K", color: "#36A534", name: "MOP", desc: "Potassium" },
];

const FertilizerRecommendation = ({ fertilizerPlan = {}, stageTarget = {} }) => {
    return (
        <div className="flex flex-col gap-3 mt-4">
            <h3 className="font-bold text-[#0E4D44] text-sm md:text-base">Fertilizer Recommendations</h3>

            {FERT_ITEMS.map((item) => (
                <div key={item.key} className="flex items-center gap-3 border rounded-xl p-3 border-l-4 border-[#D9D9D9]">
                    <div className="flex-none w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: item.color }}>
                        <span className="text-white font-bold text-lg md:text-xl">{item.symbol}</span>
                    </div>

                    <div className="flex-1 flex flex-col gap-0.5">
                        <span className="font-semibold text-sm md:text-base text-black">{item.name}</span>
                        <span className="text-xs text-black font-medium">
                            {item.desc} ({stageTarget[item.symbol] ?? 0}%)
                        </span>
                    </div>

                    <div className="flex-none font-bold text-base md:text-xl text-black">
                        {fertilizerPlan[item.key] ?? 0} kg
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FertilizerRecommendation;
