import React from "react";
import increaseRate from "../../assets/image/farm-details/increase-rate.svg";
import FarmDetailsMap from "./FarmDetailsMap";
import FarmDetailsIndex from "./FarmDetailsIndex";
import Loading from "../common/Loader";
import { useTranslation } from "react-i18next";

function FarmDetailsCropHealth({ farm, loading }) {
  const { t } = useTranslation();
  return (
    <section className="w-full flex flex-col gap-2 relative">
      <div className="flex justify-between items-center px-6 py-2">
        <h2 className="text-xl font-bold text-[#075A53]">{t("crop_health")}</h2>
        <div className="flex items-center gap-2">
          <img src={increaseRate} alt="Increase Rate" className="w-5 h-5" />
          <span className="text-[#28C878] font-semibold">0%</span>
        </div>
      </div>

      <div className="relative mx-6">
        <div className="flex items-center w-full gap-4 sm:gap-8">
          <div
            className="flex-2 h-1 border-b-4 rounded"
            style={{
              borderImageSlice: 1,
              borderImageSource:
                "linear-gradient(90deg, #34DB3E 0%, #7DE302 25.25%, #FFE600 50.19%, #FF9600 75.12%, #FF1300 100%)",
            }}
          ></div>
          <div className="flex-1 h-1 border-b-4 border-[#9A9898] rounded"></div>
        </div>

        <div className="flex justify-around mt-2 text-sm font-semibold text-[#075A53] pr-6">
          <span>{t("healthy")}</span>
          <span>{t("moderate")}</span>
          <span>{t("low")}</span>
          <span>{t("cloud")}</span>
        </div>
      </div>

      <div className="relative w-full h-[300px] sm:h-[400px]">
        {/* {loading && (
          <div className="absolute inset-0 z-[999] flex items-center justify-center bg-white/70">
            <Loading />
          </div>
        )} */}
        <FarmDetailsMap coordinates={farm.field} />
        <div className="absolute bottom-0 left-0 w-full z-[999] shadow-[0_-4px_4px_0_#F8F8F840]">
          <FarmDetailsIndex farm={farm} loading={loading} />
        </div>
      </div>
    </section>
  );
}

export default FarmDetailsCropHealth;
