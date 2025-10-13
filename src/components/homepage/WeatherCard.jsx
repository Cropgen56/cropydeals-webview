import React, { useState, useEffect } from "react";
import {
  LocationIcon,
  RainCloudeIcon,
  WindIcon,
  HumidityIcon,
  PressureIcon,
  PrecipitationIcon,
  SunIcon,
} from "../../assets/Icons";
import { useDispatch } from "react-redux";
import { getCurrentLocation } from "../../utils/getUserCurrectCoordinate";
import { getCityState } from "../../utils/getUserLocation";
import { fetchweatherData } from "../../redux/slices/weatherSlice";
import { useTranslation } from "react-i18next";
import MovingSun from "./MovingSun";

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
    <div className="flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg w-[90%] max-w-[360px] md:max-w-[500px] p-3 md:p-5 absolute top-42 font-sans">
        {/* Location & Temperature */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <h5 className="text-sm flex items-center gap-1 text-gray-800 font-bold">
              <LocationIcon />
              {city || t("city")}, {state || t("state")}
            </h5>
            <p className="text-xs text-gray-500 mt-0.5">{t("weatherToday")}</p>
          </div>
          <div className="flex items-center text-xl md:text-2xl text-teal-700 font-semibold">
            <SunIcon className="w-3 h-3 md:w-3 md:h-3" />
            <span className="pl-1">
              {Math.round(fahrenheitToCelsius(weather?.temp)) || 30}
              <sup>°</sup>C
            </span>
          </div>
        </div>

        {/* Weather Details */}
        <div className="flex justify-between items-center flex-wrap gap-y-2">
          <div className="flex flex-col items-center flex-1 min-w-[23%]">
            <WindIcon className="w-4 h-4" />
            <p className="text-[10px] text-gray-800 mt-1">
              {weather?.windspeed || "N/A"} m/s
            </p>
            <small className="text-[10px] text-teal-700 mt-1">
              {t("wind")}
            </small>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[23%]">
            <HumidityIcon className="w-4 h-4" />
            <p className="text-[10px]  text-gray-800 mt-1">
              {weather?.humidity || "N/A"}%
            </p>
            <small className="text-[10px] text-teal-700">{t("humidity")}</small>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[23%]  justify-between">
            <PressureIcon className="w-4 h-4" />
            <p className="text-[10px]  text-gray-800 mt-1">
              {weather?.pressure || "N/A"} hPa
            </p>
            <small className="text-[10px] text-teal-700 mt-2">
              {t("pressure")}
            </small>
          </div>
          <div className="flex flex-col items-center flex-1 min-w-[23%]">
            <PrecipitationIcon className="w-4 h-4" />
            <p className="text-[10px]  text-gray-800 mt-1">
              {weather?.precipprob || "0"} mm
            </p>
            <small className="text-[10px] text-teal-700">
              {t("precipitation")}
            </small>
          </div>
        </div>

        {/* Moving Sun Animation */}
        <div className="mt-2 flex justify-center items-center w-full">
          <MovingSun />
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
