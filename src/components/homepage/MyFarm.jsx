import React from "react";
import { PlusIcon } from "../../assets/Icons";
import FarmFieldCard from "./FarmFieldCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MyFarm = ({ fields }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className=" font-sans z-10 relative">
      <p className="text-[#075a53] text-lg sm:text-xl font-semibold mb-3 ">
        {t("myFarm")}
      </p>
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {/* Add field card */}
        <div
          onClick={() => navigate("/add-field")}
          className="min-w-[120px] h-[140px] sm:min-w-[160px] sm:h-[180px] border border-gray-200 rounded-lg bg-white shadow-sm flex flex-col items-center text-center p-2 cursor-pointer hover:shadow-md"
        >
          <div className="bg-gray-200 h-[60%] w-full flex justify-center items-center rounded-t-md text-xs text-gray-600">
            {t("addField")}
          </div>
          <div className="flex justify-between items-center w-full mt-2">
            <div className="text-left">
              <p className="text-xs font-semibold text-[#075a53]">
                {t("cropName")}
              </p>
              <small className="text-[10px] text-[#344e41]">
                {t("fieldSize")}
              </small>
            </div>
            <div className="bg-[#075a53] text-white rounded-full w-[28px] h-[28px] flex items-center justify-center">
              <PlusIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        {fields && fields.length > 0 ? (
          fields.map((field, idx) => <FarmFieldCard key={idx} farmDetails={field} />)
        ) : (
          <div className="text-gray-500 text-sm">{t("noFarmsAvailable")}</div>
        )}
      </div>
    </div>
  );
};

export default MyFarm;
