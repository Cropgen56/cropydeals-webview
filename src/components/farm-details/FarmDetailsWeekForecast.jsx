import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

const WEATHER_CONDITIONS = {
  rain: "🌧️",
  snow: "❄️",
  storm: "⛈️",
  clear: "☀️",
  sunny: "☀️",
  fog: "🌫️",
  overcast: "☁️",
  cloudy: "☁️",
  partly_cloudy: "⛅",
};

const getWeatherIcon = (temperature, condition) => {
  const c = (condition || "").toLowerCase();
  for (const key of Object.keys(WEATHER_CONDITIONS)) {
    if (c.includes(key)) return WEATHER_CONDITIONS[key];
  }
  if (typeof temperature === "number") {
    if (temperature >= 35) return "🔥";
    if (temperature >= 25) return "☀️";
    if (temperature >= 15) return "⛅";
    if (temperature >= 5) return "🌥️";
    return "❄️";
  }
  return "⛅";
};

const getDayName = (date, locale) =>
  new Intl.DateTimeFormat(locale, { weekday: "short" })
    .format(new Date(date))
    .toUpperCase();

export default function FarmDetailsWeekForecast({ weekForecast = [], locale }) {
  const { t, i18n } = useTranslation();
  const usedLocale = locale || i18n.language || "en-US";

  const todayDateStr = new Date().toLocaleDateString("en-CA");

  const normalized = useMemo(() => {
    if (!Array.isArray(weekForecast)) return [];
    return weekForecast.map((day) => {
      const temp = day.temp_max ?? day.temp_mean ?? day.temp ?? "--";
      const cloud = day.cloud_cover ?? 0;
      const precip = day.precipitation ?? 0;

      let condition = "clear";
      if (precip > 0) condition = "rain";
      else if (cloud >= 85) condition = "overcast";
      else if (cloud >= 40) condition = "partly_cloudy";

      return {
        day: getDayName(day.date, usedLocale),
        date: day.date,
        temp: Math.round(temp),
        icon: getWeatherIcon(temp, condition),
        precip: Math.round(precip),
      };
    });
  }, [weekForecast]);

  return (
    <div className="flex justify-between items-center text-center gap-2 overflow-x-auto no-scrollbar">
      {normalized.map((day, i) => {
        const isToday = day.date === todayDateStr;
        return (
          <div
            key={i}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 flex-shrink-0 w-[100px] ${
              isToday ? "bg-[#075A53]" : "bg-white"
            }`}
          >
            <p
              className={`text-sm font-semibold uppercase ${
                isToday ? "text-white" : "text-[#075A53]"
              }`}
            >
              {day.day}
            </p>

            <div className="flex items-center gap-1">
              <span className="text-2xl">{day.icon}</span>
              <span
                className={`text-sm font-bold ${
                  isToday ? "text-white" : "text-black"
                }`}
              >
                {day.temp}°C
              </span>
            </div>

            <p
              className={`text-sm font-semibold mt-1 ${
                isToday ? "text-white" : "text-[#9A9898]"
              }`}
            >
              {day.precip ?? "0"}%
            </p>
          </div>
        );
      })}
    </div>
  );
}
