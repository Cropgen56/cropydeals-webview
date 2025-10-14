import React from "react";
import { ArrowIcon } from "../../assets/Icons";
import { useNavigate } from "react-router-dom";
import farmImage from "../../assets/farm-field.png";
import { useTranslation } from "react-i18next";

const FarmFieldCard = ({ cropName, farmDetails, acre }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        navigate("/farm-details", { state: farmDetails });
      }}
      className="min-w-[180px] h-[240px] border-2 border-gray-300 rounded-xl bg-white shadow-md flex flex-col items-center text-center p-3 cursor-pointer transition hover:shadow-lg sm:min-w-[200px] sm:h-[260px] md:min-w-[220px]"
    >
      <img
        src={farmImage}
        alt="farm-field"
        className="w-full h-[60%] object-cover rounded-t-lg"
      />

      <div className="flex flex-col items-center justify-between w-full mt-4 sm:mt-5 md:mt-6 sm:flex-col">
        <div className="flex flex-col items-center sm:items-center text-center">
          <p className="text-base sm:text-lg font-semibold text-[#075a53] mb-1">
            {cropName}
          </p>
          <small className="text-sm sm:text-base text-[#344e41]">
            {`${t("acre")}: ${acre?.toFixed(2)}`}
          </small>
        </div>

        <div className="bg-[#075a53] text-white rounded-full w-[50px] h-[50px] flex items-center justify-center mt-3 sm:mt-4 md:mt-5 sm:w-[50px] sm:h-[50px]">
          <ArrowIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
    </div>
  );
};

export default FarmFieldCard;
