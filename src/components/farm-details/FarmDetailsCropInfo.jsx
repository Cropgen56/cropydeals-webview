import React, { useEffect } from "react";
import CropImg from "../../assets/image/farm-details/crop-img.svg";
import FarmDetailsMetrics from "./FarmDetailsMetrics";
import { useDispatch, useSelector } from "react-redux";
import { calculateAiYield } from "../../redux/slices/satelliteSlice";
import { fetchCrops } from "../../redux/slices/cropSlice";

function FarmDetailsCropInfo({ farm }) {
  const { cropHealth, cropYield } = useSelector( (state) => state.satellite || {} );
  const { cropsList } = useSelector((state) => state.crop || {});
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cropsList || cropsList.length === 0) {
      dispatch(fetchCrops());
    }
  }, [dispatch, cropsList]);

  useEffect(() => {
  if (farm?._id) {
    dispatch(calculateAiYield({ farmDetails: farm, bbchStage: 89 }));
  }
}, [dispatch, farm]);

    
  const cropName = farm?.cropName?.trim().toLowerCase() || "";
   const matchedCrop = cropsList?.find((crop) => crop.cropName?.trim().toLowerCase() === cropName);

const cropImage = matchedCrop?.cropImage ? matchedCrop?.cropImage : CropImg

  const healthPercent = Number(cropHealth?.data?.Health_Percentage) || 0;
  const healthStatus = cropHealth?.data?.Crop_Health || "-";


  const getHealthColor = (status) => {
    switch (status) {
      case "Poor":
      case "Bad":
        return "#EC1C24";
      case "Normal":
        return "#FCC21B";
      case "Good":
        return "#36A534";
      case "Very Good":
        return "#075A53";
      default:
        return "#9A9898";
    }
  };

  const healthColor = getHealthColor(healthStatus);

  // Calculate crop age
  const calculateDaysFromDate = (sowingDate) => {
    if (!sowingDate) return "N/A";

    const dateParts = sowingDate.includes("/")
      ? sowingDate.split("/").map(Number)
      : null;
    const date = dateParts
      ? new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
      : new Date(sowingDate);

    const now = new Date();
    const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : 0;
  };

  return (
    <section className="bg-white rounded-xl border border-[#D9D9D9] p-4 flex flex-col gap-4">
      <FarmDetailsMetrics cropHealth={cropHealth} />

      <div className="flex items-center gap-4 sm:gap-8 sm:mx-8">
        <img
            src={cropImage}
            alt={farm?.cropName || "Crop"}
          className="w-[100px] h-[100px] rounded-lg border-2 border-[#075A53] object-cover"
        />
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex">
            <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
              Crop Name
            </span>
            <span className="text-xs sm:text-base font-semibold text-black">
              : {farm?.cropName || "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
              Crop Age
            </span>
            <span className="text-xs sm:text-base font-semibold text-black">
              : {calculateDaysFromDate(farm?.sowingDate)} days
            </span>
          </div>
          <div className="flex">
            <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
              Standard Yield
            </span>
            <span className="text-xs sm:text-base font-semibold text-black">
              : {cropYield?.data?.standard_yield ?? "N/A"}
            </span>
          </div>
          <div className="flex">
            <span className="text-xs sm:text-base font-bold text-[#344E41] w-1/2 sm:w-1/3">
              Total Area
            </span>
            <span className="text-xs sm:text-base font-semibold text-black">
              : {farm?.acre?.toFixed(2)} Acre
            </span>
          </div>
        </div>
      </div>

      <div className="sm:mx-8">
        <h3 className="text-xs sm:text-base font-bold text-[#344E41] mb-2">
          Overall Crop Health
        </h3>

        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="text-lg font-bold text-black mr-2">
              {healthPercent}%
            </span>
            <span className="text-xs font-semibold text-[#9A9898]">
              {healthStatus}
            </span>
          </div>

          <div
            className="text-white text-[10px] font-bold rounded px-2 py-1"
            style={{ backgroundColor: healthColor }}
          >
            {healthStatus}
          </div>
        </div>

        <div className="h-2 bg-[#E0E0E0] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${healthPercent}%`, backgroundColor: healthColor }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default FarmDetailsCropInfo;
