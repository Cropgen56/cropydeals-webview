import React, { useMemo, useRef, useState, useEffect } from "react";
import LocationIcon from "../../assets/image/farm-details/location.svg";
import WindIcon from "../../assets/image/farm-details/wind.svg";
import HumidityIcon from "../../assets/image/farm-details/humidity.svg";
import PressureIcon from "../../assets/image/farm-details/pressure.svg";
import PrecipitationIcon from "../../assets/image/farm-details/precipitation.svg";
import FarmDetailsWeekForecast from "./FarmDetailsWeekForecast";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecastData } from "../../redux/slices/weatherSlice";
import getLocation from "../../utils/getLocation";
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

const getWeatherIcon = (condition) => {
  const c = (condition || "").toLowerCase();
  for (const key of Object.keys(WEATHER_CONDITIONS)) {
    if (c.includes(key)) return WEATHER_CONDITIONS[key];
  }
  return "⛅";
};

const deriveConditionFromCurrent = (current) => {
  if (!current) return "partly_cloudy";
  const precip = current.precipitation ?? current.rain ?? 0;
  const cloud = current.cloud_cover ?? -1;
  if (precip > 0) return "rain";
  if (cloud >= 85) return "overcast";
  if (cloud >= 40) return "partly_cloudy";
  return "clear";
};

const formatIsoTime = (isoStr) => {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    if (isNaN(d)) return isoStr;
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    const mm = m.toString().padStart(2, "0");
    return `${h}:${mm} ${ampm}`;
  } catch {
    return isoStr;
  }
};

const calculatePolygonCentroid = (coordinates) => {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return { centroidLat: null, centroidLng: null };
  }
  let sumLat = 0;
  let sumLng = 0;
  coordinates.forEach((p) => {
    sumLat += Number(p.lat) || 0;
    sumLng += Number(p.lng) || 0;
  });
  const n = coordinates.length;
  return { centroidLat: sumLat / n, centroidLng: sumLng / n };
};

const FarmDetailsWeatherCard = ({ farm }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { forecastData: forecastDataRaw, aois = [] } = useSelector(
    (state) => state.weather || {}
  );

  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const fetchedRef = useRef(new Set());

  const centroid = useMemo(() => {
    if (!farm?.field?.length) return { centroidLat: null, centroidLng: null };
    return calculatePolygonCentroid(farm.field);
  }, [farm]);

  const { current, forecastSource } = useMemo(() => {
    const cur = forecastDataRaw?.current ?? null;
    const src = forecastDataRaw?.forecast ?? forecastDataRaw ?? null;
    return { current: cur, forecastSource: src };
  }, [forecastDataRaw]);

  const weekForecast = useMemo(() => {
    const src = forecastSource;
    if (!src || !Array.isArray(src.time)) return [];
    const len = src.time.length;
    const arr = [];
    for (let i = 0; i < len; i += 1) {
      arr.push({
        date: src.time[i],
        temp_max: src.temp_max?.[i] ?? null,
        temp_min: src.temp_min?.[i] ?? null,
        precipitation: src.precipitation?.[i] ?? null,
        cloud_cover: src.cloud_cover?.[i] ?? null,
      });
    }
    return arr;
  }, [forecastSource]);

  useEffect(() => {
    const initLocation = async () => {
      if (!centroid?.centroidLat || !centroid?.centroidLng) return;
      try {
        const location = await getLocation(
          centroid.centroidLat,
          centroid.centroidLng
        );
        setCity(location?.city || "Unknown City");
        setStateName(location?.state || "Unknown State");
      } catch (err) {
        console.warn("Error fetching location:", err);
      }
    };
    initLocation();
  }, [centroid]);

  useEffect(() => {
    if (!farm) return;
    const aoiName = farm._id;
    if (!aoiName) return;
    const existing = aois.find((a) => a.name === aoiName && a.id);
    if (existing?.id && !fetchedRef.current.has(existing.id)) {
      fetchedRef.current.add(existing.id);
      dispatch(fetchForecastData({ geometry_id: existing.id })).catch((err) =>
        console.warn("fetchForecastData err:", err)
      );
    }
  }, [farm, aois, dispatch]);

  const lastUpdated = formatIsoTime(
    current?.time ?? forecastSource?.time?.[0] ?? ""
  );
  const tempC =
    current?.temp !== undefined && current?.temp !== null
      ? Math.round(current.temp)
      : "--";
  const humidity = current?.relative_humidity ?? "--";
  const windSpeed = current?.wind_speed ?? "--";
  const pressure = current?.surface_pressure ?? "--";
  const precipitation = current?.precipitation ?? current?.rain ?? "--";

  const derivedCond = deriveConditionFromCurrent(current);
  const weatherIcon = getWeatherIcon(derivedCond);

  const stats = [
    { label: t("wind"), value: `${windSpeed} km/h`, image: WindIcon },
    { label: t("humidity"), value: `${humidity}%`, image: HumidityIcon },
    { label: t("pressure"), value: `${pressure} hPa`, image: PressureIcon },
    {
      label: t("precipitation"),
      value: `${precipitation} mm`,
      image: PrecipitationIcon,
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 md:p-6 flex flex-col gap-3 md:gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl md:text-2xl font-bold text-[#075A53]">
          {t("Weather")}
        </h2>
        <p className="text-xs md:text-sm font-semibold text-[#9A9898]">
          {t("last_updated")}: {lastUpdated}
        </p>
      </div>

      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{weatherIcon}</span>
          <p className="text-xl md:text-2xl font-bold text-black">{tempC}°C</p>
        </div>

        <div className="flex items-center gap-1 text-[#9A9898] text-sm font-semibold">
          <img
            src={LocationIcon}
            alt="location"
            className="w-4 h-4 md:w-5 md:h-5"
          />
          <span>
            {city}, {stateName}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#9A98981F] rounded-lg p-3 flex justify-between items-center"
          >
            <div className="flex flex-col gap-0.5">
              <p className="text-base font-bold text-black">{item.label}</p>
              <p className="text-sm font-medium text-black">{item.value}</p>
            </div>
            <img
              src={item.image}
              alt={item.label}
              className="w-6 h-6 object-contain"
            />
          </div>
        ))}
      </div>

      <h3 className="text-sm md:text-base font-semibold text-black">
        {t("this_week")}
      </h3>

      <FarmDetailsWeekForecast weekForecast={weekForecast} />
    </section>
  );
};

export default FarmDetailsWeatherCard;
