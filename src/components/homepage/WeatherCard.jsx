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
  const dispatch = useDispatch();
  const { t } = useTranslation();

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
    }
  }, [location, dispatch]);

  function fahrenheitToCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
  }

  return (
    <div className="bg-white shadow-lg rounded-2xl w-full p-4 flex flex-col justify-between md:max-w-full md:w-full">
      <div className="flex  justify-between items-center">
        <div className="text-center sm:text-left">
          <h5 className="text-sm flex items-center justify-center sm:justify-start gap-1 font-bold text-gray-800">
            <LocationIcon />
            {city || t("city")}, {state || t("state")}
          </h5>
          <p className="text-xs text-gray-500">{t("Weather Today")}</p>
        </div>
        <div className="flex items-center justify-center sm:justify-end text-2xl font-semibold text-[#075a53] mt-2 sm:mt-0">
          <SunIcon className="w-4 h-4 mr-1" />
          {weather?.temp ? Math.round(fahrenheitToCelsius(weather.temp)) : "-"}
          <sup>°</sup>C
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap">
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <WindIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.windspeed || "N/A"} m/s</p>
          <small className="text-[10px] text-[#075a53]">{t("wind")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <HumidityIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.humidity || "N/A"}%</p>
          <small className="text-[10px] text-[#075a53]">{t("humidity")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <PressureIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.pressure || "N/A"} hPa</p>
          <small className="text-[10px] text-[#075a53]">{t("pressure")}</small>
        </div>
        <div className="flex flex-col items-center flex-1 min-w-[70px]">
          <PrecipitationIcon className="w-4 h-4" />
          <p className="text-[10px]">{weather?.precipprob || "0"} mm</p>
          <small className="text-[10px] text-[#075a53]">{t("precipitation")}</small>
        </div>
      </div>

      <div className="mt-4 flex justify-center w-full">
        <MovingSun />
      </div>
    </div>
  );
};

export default WeatherCard;
