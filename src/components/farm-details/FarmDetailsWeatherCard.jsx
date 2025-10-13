import React from "react";
import LocationIcon from "../../assets/image/farm-details/location.svg";
import WindIcon from "../../assets/image/farm-details/wind.svg";
import HumidityIcon from "../../assets/image/farm-details/humidity.svg";
import PressureIcon from "../../assets/image/farm-details/pressure.svg";
import PrecipitationIcon from "../../assets/image/farm-details/precipitation.svg";
import FarmDetailsWeekForecast from "./FarmDetailsWeekForecast";

export default function FarmDetailsWeatherCard() {
    const weatherData = {
        lastUpdated: "10:45 AM",
        location: "Shahdara, Delhi",
        temperature: 28,
        icon: "☀️",
        stats: [
            { label: "Wind", value: "12 km/h", image: WindIcon },
            { label: "Humidity", value: "65%", image: HumidityIcon },
            { label: "Pressure", value: "1013 hPa", image: PressureIcon },
            { label: "Precipitation", value: "3 mm", image: PrecipitationIcon },
        ],
        weekForecast: [
            { day: "Mon", temp: 29, icon: "☀️" },
            { day: "Tue", temp: 27, icon: "⛅" },
            { day: "Wed", temp: 30, icon: "☀️" },
            { day: "Thu", temp: 31, icon: "☀️" },
            { day: "Fri", temp: 26, icon: "🌧️" },
            { day: "Sat", temp: 28, icon: "⛅" },
            { day: "Sun", temp: 27, icon: "🌤️" },
        ],
    };

    return (
        <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-3 md:gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl md:text-2xl font-bold text-[#075A53]">Weather</h2>
                <p className="text-xs md:text-sm font-semibold text-[#9A9898]">
                    Last Updated: {weatherData.lastUpdated}
                </p>
            </div>

            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-3xl">{weatherData.icon}</span>
                    <p className="text-xl md:text-2xl font-bold text-black">
                        {weatherData.temperature}°C
                    </p>
                </div>

                <div className="flex items-center gap-1 text-[#9A9898] text-sm font-semibold">
                    <img
                        src={LocationIcon}
                        alt="location"
                        className="w-4 h-4 md:w-5 md:h-5"
                    />
                    <span>{weatherData.location}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {weatherData.stats.map((item, idx) => (
                    <div
                        key={idx}
                        className="bg-[#9A98981F] rounded-lg p-3 flex justify-between items-center" >
                        <div className="flex flex-col gap-0.5">
                            <p className="text-base font-bold text-black">{item.label}</p>
                            <p className="text-sm font-medium text-black">{item.value}</p>
                        </div>
                        <img
                            src={item.image}
                            alt={item.label}
                            className="w-6 h-6 object-contain" />
                    </div>
                ))}
            </div>

            <h3 className="text-sm md:text-base font-semibold text-black">
                This Week
            </h3>

            <FarmDetailsWeekForecast weekForecast={weatherData.weekForecast} />
        </section>
    );
}
