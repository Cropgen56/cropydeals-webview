import React from "react";

export default function FarmDetailsWeekForecast({ weekForecast = [] }) {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });

    return (
        <div className="flex justify-between items-center text-center gap-2 overflow-x-auto no-scrollbar">
            {weekForecast.map((day, i) => {
                const isToday = day.day === today;
                return (
                    <div
                        key={i}
                        className={`flex flex-col items-center gap-1 rounded-lg p-2 flex-shrink-0 w-[100px] ${
                            isToday ? "bg-[#075A53]" : "bg-[#F8F8F8]"
                        }`} >
                        <p
                            className={`text-sm font-semibold uppercase ${
                                isToday ? "text-white" : "text-[#075A53]"
                            }`} >
                            {day.day}
                        </p>

                        <div className="flex items-center gap-1">
                            <span className="text-xl">{day.icon}</span>
                            <span className={`text-sm font-semibold ${ isToday ? "text-white" : "text-black" }`}>
                                {day.temp}°C
                            </span>
                        </div>

                        <p className={`text-sm font-semibold mt-1 ${ isToday ? "text-white" : "text-[#9A9898]" }`} >
                            {day.precip ?? "0"}%
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
