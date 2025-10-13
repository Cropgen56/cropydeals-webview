import React from "react";
import SoilMoistureIcon from "../../assets/image/farm-details/soil-moisture.svg";
import SoilTempIcon from "../../assets/image/farm-details/soil-temperature.svg";
import ChartImage from "../../assets/image/farm-details/chart.svg";

const FarmDetailsMoistureTemperature = () => {
  return (
    <section className="bg-white rounded-xl border border-[#E6EEF0] md:px-8 p-4 flex flex-col gap-4">
      {/* Top Info Boxes */}
      <div className="flex justify-between gap-4">
        {/* Soil Temperature */}
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
            <span className="text-white text-lg font-bold mt-1">--°C</span>
          </div>
        </div>

        {/* Soil Moisture */}
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
            <span className="text-white text-lg font-bold mt-1">-- m³/m³</span>
          </div>
        </div>
      </div>

      {/* Chart */}
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
