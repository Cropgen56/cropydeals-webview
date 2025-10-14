import React, { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { getCurrentLocation } from "../../utils/getUserCurrectCoordinate";
import { getCityState } from "../../utils/getUserLocation";
import { fetchweatherData } from "../../redux/slices/weatherSlice";

const WeatherCard = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const weather = JSON.parse(localStorage.getItem("weatherData"))
    ?.currentConditions || {
    temp: null,
    humidity: null,
    pressure: null,
    windspeed: null,
    precipitation: null,
    precipprob: null,
  };

  const updateWeatherData = () => {
    if (location) {
      const { latitude, longitude } = location;
      dispatch(fetchweatherData({ latitude, longitude })).then((action) => {
        if (action.payload) {
          localStorage.setItem("weatherData", JSON.stringify(action.payload));
          localStorage.setItem("lastFetchTime", Date.now());
        }
      });
    }
  };

  useEffect(() => {
    getCurrentLocation({
      setLocation: (loc) => {
        setLocation(loc);
        if (loc?.latitude && loc?.longitude) {
          getCityState({
            lat: loc.latitude,
            lng: loc.longitude,
            setCity,
            setState,
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    const storedFetchTime = localStorage.getItem("lastFetchTime");
    const currentTime = Date.now();

    if (
      !storedFetchTime ||
      currentTime - parseInt(storedFetchTime, 10) > 3 * 60 * 60 * 1000
    ) {
      updateWeatherData();
    } else {
      setLastFetchTime(storedFetchTime);
    }
  }, [location, dispatch]);

  function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full max-w-[360px] p-4 flex flex-col justify-between">
      {/* 📍 Location + Temp */}
      <div className="flex justify-between items-center">
        <div>
          <h5 className="text-sm flex items-center gap-1 font-bold text-gray-800">
            <LocationIcon />
            {city || t("city")}, {state || t("state")}
          </h5>
          <p className="text-xs text-gray-500">{t("weatherToday")}</p>
        </div>
        <div className="flex items-center text-2xl font-semibold text-[#075a53]">
          <SunIcon className="w-4 h-4 mr-1" />
          {weather?.temp ? Math.round(fahrenheitToCelsius(weather.temp)) : "-"}
          <sup>°</sup>C
        </div>
      </div>

      {/* 🌡️ Weather details */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex flex-col items-center flex-1">
          <WindIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.windspeed || "N/A"} m/s</p>
          <small className="text-[10px] text-[#075a53]">{t("wind")}</small>
        </div>
        <div className="flex flex-col items-center flex-1">
          <HumidityIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.humidity || "N/A"}%</p>
          <small className="text-[10px] text-[#075a53]">{t("humidity")}</small>
        </div>
        <div className="flex flex-col items-center flex-1">
          <PressureIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.pressure || "N/A"} hPa</p>
          <small className="text-[10px] text-[#075a53]">{t("pressure")}</small>
        </div>
        <div className="flex flex-col items-center flex-1">
          <PrecipitationIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.precipprob || "0"} mm</p>
          <small className="text-[10px] text-[#075a53]">
            {t("precipitation")}
          </small>
        </div>
      </div>

      {/* ☀️ Sun path animation */}
      <div className="mt-1 flex justify-center">
        <MovingSun />
      </div>
    </div>
  );
};

export default WeatherCard;