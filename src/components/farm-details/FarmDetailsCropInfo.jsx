import React from "react";
import CropImage from "../../assets/image/farm-details/crop-img.svg";
import FarmDetailsMetrics from "./FarmDetailsMetrics";

function FarmDetailsCropInfo() {
    const getHealthColor = (status) => {
        switch (status) {
        case "Bad":
            return "#EC1C24"; 
        case "Normal":
            return "#FCC21B";
        case "Good":
            return "#36A534"; 
        case "Very Good":
            return "#075A53"; 
        default:
            return "#9A9898"; 
        }
    };

    const cropData = {
        name: "Wheat",
        age: "45 days",
        yield: "N/A",
        area: "2.0 Acre",
        healthPercent: 78,
        healthStatus: "Good",
    };

    const healthColor = getHealthColor(cropData.healthStatus);

    return (
        <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 flex flex-col gap-4">
            <FarmDetailsMetrics />

            <div className="flex items-center gap-4 sm:gap-8 sm:mx-8">
                <img
                    src={CropImage}
                    alt="Crop"
                    className="w-[100px] h-[100px] rounded-lg border-2 border-[#075A53] object-cover"
                />
                <div className="flex flex-col flex-1 gap-1">
                    <div className="flex">
                        <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
                            Crop Name
                        </span>
                        <span className="text-xs sm:text-base font-semibold text-black">
                            : {cropData.name}
                        </span>
                    </div>
                    <div className="flex">
                        <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
                            Crop Age
                        </span>
                        <span className="text-xs sm:text-base font-semibold text-black">
                            : {cropData.age}
                        </span>
                    </div>
                    <div className="flex">
                        <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
                            Standard Yield
                        </span>
                        <span className="text-xs sm:text-base font-semibold text-black">
                            : {cropData.yield}
                        </span>
                    </div>
                    <div className="flex">
                        <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
                            Total Area
                        </span>
                        <span className="text-xs sm:text-base font-semibold text-black">
                            : {cropData.area}
                        </span>
                    </div>
                </div>
            </div>

            <div className="sm:mx-8">
                <h3 className="text-xs sm:text-base font-bold text-[#344E41] mb-2">
                    Overall Crop Health
                </h3>

                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <span className="text-lg font-bold text-black mr-2">
                            {cropData.healthPercent}%
                        </span>
                        <span className="text-xs font-semibold text-[#9A9898]">
                            {cropData.healthStatus}
                        </span>
                    </div>

                <div className="text-white text-[10px] font-bold rounded px-2 py-1"
                    style={{ backgroundColor: healthColor }}>
                        {cropData.healthStatus}
                </div>
            </div>

            <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${cropData.healthPercent}%`, backgroundColor: healthColor, }}></div>
                </div>
            </div>
        </section>
    );
}

export default FarmDetailsCropInfo;
