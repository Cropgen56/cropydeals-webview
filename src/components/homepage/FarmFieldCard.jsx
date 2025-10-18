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
      onClick={() => navigate("/farm-details", { state: { farm: farmDetails } })}
      className="min-w-[120px] h-[140px] sm:min-w-[160px] sm:h-[180px] p-1 border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col cursor-pointer hover:shadow-md"
    >
      <img
        src={farmImage}
        alt="farm-field"
        className="w-full h-[60%] object-cover rounded-t-lg"
      />

      <div className="flex justify-between items-center px-1 sm:px-2 mt-2">
        <div className="flex flex-col text-left overflow-hidden">
          <p
            className="text-xs sm:text-sm font-semibold text-[#075a53] truncate max-w-[80px] sm:max-w-[110px]"
            title={cropName}
          >
            {/* {t(`crops.${cropName}`, cropName)}; */} {cropName}
          </p>
          <small className="text-[10px] sm:text-xs text-[#344e41] whitespace-nowrap">
            {`${t("acre")}: ${acre?.toFixed(2)}`}
          </small>
        </div>

        <div className="bg-[#075a53] text-white rounded-full w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] flex items-center justify-center flex-shrink-0">
          <ArrowIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default FarmFieldCard;
