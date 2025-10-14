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
      onClick={() => navigate("/farm-details", { state: farmDetails })}
      className="min-w-[120px] h-[140px] sm:min-w-[160px] sm:h-[180px] p-2 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col cursor-pointer hover:shadow-md"
    >
      {/* Top Image */}
      <img
        src={farmImage}
        alt="farm-field"
        className="w-full h-[60%] object-cover rounded-t-lg"
      />

      {/* Bottom Section: Left = crop + acre, Right = icon */}
      <div className="flex justify-between items-center px-2 mt-2">
        {/* Left side */}
        <div className="flex flex-col text-left">
          <p className="text-sm sm:text-base font-semibold text-[#075a53]">
            {cropName}
          </p>
          <small className="text-xs sm:text-sm text-[#344e41]">
            {`${t("acre")}: ${acre?.toFixed(2)}`}
          </small>
        </div>

        {/* Right side */}
        <div className="bg-[#075a53] text-white rounded-full w-[28px] h-[28px] flex items-center justify-center">
          <ArrowIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default FarmFieldCard;
