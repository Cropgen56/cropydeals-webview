import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import SoilMoistureIcon from "../../assets/image/farm-details/soil-moisture.svg";
import SoilTempIcon from "../../assets/image/farm-details/soil-temperature.svg";
import ChartImage from "../../assets/image/farm-details/chart.svg";

const safeNum = (v) => {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const formatOne = (n) => {
  if (n === null) return null;
  return Number.isInteger(n) ? `${n}` : `${n.toFixed(1)}`;
};

const pickFirst = (obj, keys) => {
  if (!obj) return null;
  for (const k of keys) {
    if (obj[k] !== undefined && obj[k] !== null) return safeNum(obj[k]);
  }
  return null;
};

const FarmDetailsMoistureTemperature = () => {
  const forecastRaw = useSelector(
    (state) => state.weather?.forecastData ?? null,
    shallowEqual
  );

  const forecastCurrent = forecastRaw?.current ?? forecastRaw ?? null;

  const soilMoistureKeys = [
    "soil_moisture_surface",
    "soil_moisture_2cm",
    "soil_moisture_5cm",
    "soil_moisture_15cm",
    "soil_moisture",
    "soil_moisture_mean",
  ];
  const soilTempKeys = [
    "soil_temperature_surface",
    "soil_temperature_2cm",
    "soil_temperature_5cm",
    "soil_temperature_15cm",
    "soil_temperature",
    "soil_temperature_mean",
  ];

  const forecastSoilMoisture = pickFirst(forecastCurrent, soilMoistureKeys);
  const forecastSoilTemp = pickFirst(forecastCurrent, soilTempKeys);

  const soilMoistureDisplay =
    forecastSoilMoisture !== null
      ? `${formatOne(forecastSoilMoisture)} m³/m³`
      : "N/A";
  const soilTemperatureDisplay =
    forecastSoilTemp !== null ? `${formatOne(forecastSoilTemp)}°C` : "N/A";

  // console.log("soil moisture:", forecastSoilMoisture);
  // console.log("soil temperature:", forecastSoilTemp);

  return (
    <section className="bg-white rounded-xl border border-[#E6EEF0] md:px-8 p-4 flex flex-col gap-4">
      <div className="flex justify-between gap-4">
        <div className="flex items-center bg-[#184D47] rounded-xl p-3 w-44">
          <img
            src={SoilTempIcon}
            alt="Soil Temperature"
            className="w-7 h-7 mr-2"
          />
          <div className="flex flex-col items-start">
            <span className="text-[#D8F3DC] text-xs font-semibold">
              Soil Temperature
            </span>
            <span className="text-white text-lg font-bold mt-1">
              {soilTemperatureDisplay}
            </span>
          </div>
        </div>

        <div className="flex items-center bg-[#184D47] rounded-xl p-3 w-44">
          <img
            src={SoilMoistureIcon}
            alt="Soil Moisture"
            className="w-7 h-7 mr-2"
          />
          <div className="flex flex-col items-start">
            <span className="text-[#D8F3DC] text-xs font-semibold">
              Soil Moisture
            </span>
            <span className="text-white text-lg font-bold mt-1">
              {soilMoistureDisplay}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <img
          src={ChartImage}
          alt="Soil Health Chart"
          className="w-full max-h-[200px] object-contain"
        />
      </div>
    </section>
  );
};

export default FarmDetailsMoistureTemperature;
