import React from "react";

function FarmDetailsMetrics() {
    const metrics = [
        { label: "NDVI", value: "0.45" },
        { label: "Moisture", value: "25%" },
        { label: "SOC", value: "N/A" },
    ];

    return (
        <div className="flex justify-between gap-4">
            {metrics.map((metric, index) => (
                <div key={index}
                    className={`flex-1 flex flex-col items-center justify-between py-2 px-3 ${ index !== metrics.length - 1 ? "border-r border-[#D9D9D9]" : "" }`} >
                    <span className="text-[#9A9898] font-semibold text-xs md:text-base">
                        {metric.label}
                    </span>
                    <span className="text-black font-bold text-base md:text-xl">{metric.value}</span>
                </div>
            ))}
        </div>
    );
}

export default FarmDetailsMetrics;
