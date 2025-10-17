import React from "react";
import greenPeas from "../../assets/image/mandi/peas.png";
import wheat from "../../assets/image/mandi/wheat.png";
import onion from "../../assets/image/mandi/onion.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MandiRate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const crops = [
    { name: t("greenPeas"), image: greenPeas },
    { name: t("wheat"), image: wheat },
    { name: t("onion"), image: onion },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-5 mx-4 mt-6">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center mb-5">
        <div>
          <h2 className="text-xl sm:text-3xl font-bold text-emerald-900">
            {t("mandiRate")}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-1">
            {t("getRealTimeMandiRates")}
          </p>
        </div>
        <button
          onClick={() => {
            navigate("/mandi-rates");
          }}
          className="mt-3 sm:mt-0 bg-emerald-900 text-white text-sm sm:text-lg font-semibold py-2 px-5 sm:px-7 rounded-2xl hover:bg-emerald-800 transition"
        >
          {t("checkRate")}
        </button>
      </div>

      {/* Crop Cards */}
      <div className="flex justify-center items-center gap-4 sm:gap-8 mt-4">
        {crops.map((crop, index) => (
          <div
            key={index}
            className="relative w-28 h-28 sm:w-28 sm:h-28 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <img
              src={crop.image}
              alt={crop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-[#075A53B2] text-center text-white py-1 text-xs font-semibold">
              {crop.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MandiRate;
