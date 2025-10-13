import React, { useState } from "react";
import CalendarWhite from "../../assets/image/farm-details/calender.svg";
import CalendarGreen from "../../assets/image/farm-details/calender-green.svg";

const indexKeys = [
  "TRUE_COLOR", "NDVI", "EVI", "EVI2", "SAVI", "MSAVI", "NDMI", "NDWI",
  "SMI", "CCC", "NDRE", "NITROGEN", "SOC", "RECI"
];

const mockDates = [
    { date: "2025-10-01", cloud_cover: 12 },
    { date: "2025-10-03", cloud_cover: 30 },
    { date: "2025-10-05", cloud_cover: 0 },
    { date: "2025-10-07", cloud_cover: 19 },
    { date: "2025-10-09", cloud_cover: 35 },
    { date: "2025-10-20", cloud_cover: 0 },
];

const FarmDetailsIndex = () => {
    const [selectedIndex, setSelectedIndex] = useState("NDVI");
    const [selectedDate, setSelectedDate] = useState(mockDates[0].date);

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
        }).format(new Date(date));
    };

    return (
        <div className="flex flex-col w-full bg-[#075A53] rounded-t-2xl p-3">
        
            <div className="flex justify-between overflow-x-auto no-scrollbar lg:mx-8">
                {indexKeys.map((item) => (
                    <button
                        key={item}
                        onClick={() => setSelectedIndex(item)}
                        className={`text-xs sm:text-sm font-semibold px-4 md:px-0 py-1 sm:py-2 cursor-pointer transition-all duration-500 ease-in-out ${
                        selectedIndex === item
                            ? "text-white border-b border-white"
                            : "text-[#D9D9D9]" }`} >
                            {item}
                    </button>
                ))}
            </div>

            <div className="flex justify-between overflow-x-auto mt-2 gap-2 no-scrollbar lg:mx-8">
                {mockDates.map((item, idx) => {
                    const isSelected = selectedDate === item.date;
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedDate(item.date)}
                            className={`flex flex-col items-center justify-center rounded-4xl px-3 py-1 sm:px-4 sm:py-2 border min-w-[110px] sm:min-w-[130px] cursor-pointer transition-all duration-500 ease-in-out ${
                                isSelected ? "bg-white border-white" : "bg-[#0A796F] border-[#D9D9D9]"
                            }`} >
                            <div className="flex items-center gap-1 whitespace-nowrap">
                                <img
                                    src={isSelected ? CalendarGreen : CalendarWhite}
                                    alt="calendar"
                                    className="w-4 h-4 sm:w-5 sm:h-5"
                                />
                                <span className={`text-[10px] sm:text-xs font-semibold ${isSelected ? "text-[#075A53]" : "text-[#fff]"}`}>
                                    {formatDate(item.date)}
                                </span>
                            </div>

                            <span className={`text-[8px] sm:text-[10px] font-semibold mt-1 ${isSelected ? "text-[#075A53]" : "text-[#D9D9D9]"}`}>
                                {item.cloud_cover}% Cloud
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default FarmDetailsIndex;
