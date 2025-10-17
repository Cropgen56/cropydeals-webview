import React, { useEffect, useState, useRef } from "react";
import {
  LocationIcon,
  WindIcon,
  HumidityIcon,
  PressureIcon,
  PrecipitationIcon,
  SunIcon,
} from "../../assets/Icons";
import MovingSun from "./MovingSun";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentLocation } from "../../utils/getUserCurrectCoordinate";
import { getCityState } from "../../utils/getUserLocation";
import {
  fetchweatherData,
  fetchAOIs,
  createAOI,
} from "../../redux/slices/weatherSlice";

const WeatherCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentWeather = useSelector((state) => state.weather.currentWeather);
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [loading, setLoading] = useState(true);
  const creatingRef = useRef(false);

  const storedKeyFor = (name) => `aoi_${name}`;

  const metersToLatLngDelta = (meters, atLat) => {
    const degLat = meters / 111320;
    const latRad = (atLat * Math.PI) / 180;
    const degLng = meters / (111320 * Math.cos(latRad));
    return { deltaLat: degLat, deltaLng: degLng };
  };

  const buildSquarePolygonFromPoint = ({ lat, lng }, halfSideMeters = 50) => {
    const { deltaLat, deltaLng } = metersToLatLngDelta(halfSideMeters, lat);
    const bl = [lng - deltaLng, lat - deltaLat];
    const br = [lng + deltaLng, lat - deltaLat];
    const tr = [lng + deltaLng, lat + deltaLat];
    const tl = [lng - deltaLng, lat + deltaLat];
    return { type: "Polygon", coordinates: [[bl, br, tr, tl, bl]] };
  };

  const buildAOINameFromCoords = ({ lat, lng }) => {
    const a = Math.round(lat * 10000);
    const b = Math.round(lng * 10000);
    return `${a}${b}`;
  };

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        getCurrentLocation({
          setLocation: async (loc) => {
            if (!loc?.latitude || !loc?.longitude) return;

            const { latitude: lat, longitude: lng } = loc;
            try {
              const locData = await getCityState({ lat, lng });
              if (locData.length > 0) {
                setCity(locData[0].name || "Unknown City");
                setStateName(locData[0].state || "Unknown State");
              } else {
                setCity("Unknown City");
                setStateName("Unknown State");
              }
            } catch (e) {
              console.warn("Reverse geocode failed:", e);
              setCity("Unknown City");
              setStateName("Unknown State");
            }

            const name = buildAOINameFromCoords({ lat, lng });
            const polygon = buildSquarePolygonFromPoint({ lat, lng }, 50);
            const payload = { name, geometry: polygon };

            // Check localStorage for cached AOI
            const storedRaw = localStorage.getItem(storedKeyFor(name));
            if (storedRaw) {
              try {
                const parsed = JSON.parse(storedRaw);
                if (parsed?.id) {
                  await dispatch(fetchweatherData({ geometry_id: parsed.id }));
                  if (!cancelled) setLoading(false);
                  return;
                }
              } catch {}
            }

            // Fetch AOIs from server
            let serverAOIs = [];
            try {
              serverAOIs = await dispatch(fetchAOIs()).unwrap();
            } catch (e) {
              console.warn("fetchAOIs failed:", e);
            }

            const existing = serverAOIs.find((aoi) => aoi.name === name);
            if (existing?.id) {
              localStorage.setItem(
                storedKeyFor(name),
                JSON.stringify({ id: existing.id, name })
              );
              await dispatch(fetchweatherData({ geometry_id: existing.id }));
              if (!cancelled) setLoading(false);
              return;
            }

            // Create AOI if missing
            if (!creatingRef.current) {
              try {
                creatingRef.current = true;
                const createdId = await dispatch(createAOI(payload)).unwrap();
                if (createdId) {
                  localStorage.setItem(
                    storedKeyFor(name),
                    JSON.stringify({ id: createdId, name })
                  );
                  await dispatch(fetchweatherData({ geometry_id: createdId }));
                }
              } catch (e) {
                console.warn("createAOI failed:", e);
              } finally {
                creatingRef.current = false;
                if (!cancelled) setLoading(false);
              }
            }
          },
        });
      } catch (err) {
        console.error("Unexpected error in WeatherCard init:", err);
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  const weatherData = currentWeather
    ? {
        temp:
          currentWeather.temp != null
            ? `${Math.round(currentWeather.temp)}°C`
            : "--",
        windSpeed:
          currentWeather.wind_speed != null
            ? `${currentWeather.wind_speed} km/h`
            : "--",
        humidity:
          currentWeather.relative_humidity != null
            ? `${currentWeather.relative_humidity}%`
            : "--",
        pressure:
          currentWeather.surface_pressure != null
            ? `${currentWeather.surface_pressure} hPa`
            : "--",
        precipitation:
          currentWeather.precipitation != null
            ? `${currentWeather.precipitation} mm`
            : "0 mm",
        sunrise: "5:30 AM",
        sunset: "6:30 PM",
      }
    : {};

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full p-4 flex flex-col justify-between md:max-w-full md:w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <LocationIcon className="w-4 h-4" />
          <span className="text-sm font-bold text-gray-800">
            {city || t("city")}, {stateName || t("state")}
          </span>
        </div>
        <div className="flex items-center gap-1 justify-end text-xl font-semibold text-[#075a53]">
          <SunIcon className="w-4 h-4" />
          {weatherData.temp || "-"}
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap">
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <WindIcon className="w-4 h-4" />
          <p className="text-[10px]">{weatherData.windSpeed || "N/A"}</p>
          <small className="text-[10px] text-[#075a53]">{t("wind")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <HumidityIcon className="w-4 h-4" />
          <p className="text-[10px]">{weatherData.humidity || "N/A"}</p>
          <small className="text-[10px] text-[#075a53]">{t("humidity")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <PressureIcon className="w-4 h-4" />
          <p className="text-[10px]">{weatherData.pressure || "N/A"}</p>
          <small className="text-[10px] text-[#075a53]">{t("pressure")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <PrecipitationIcon className="w-4 h-4" />
          <p className="text-[10px]">{weatherData.precipitation || "0"}</p>
          <small className="text-[10px] text-[#075a53]">
            {t("precipitation")}
          </small>
        </div>
      </div>

      <div className="mt-4 flex justify-center w-full">
        <MovingSun sunrise={weatherData.sunrise} sunset={weatherData.sunset} />
      </div>
    </div>
  );
};

export default WeatherCard;
