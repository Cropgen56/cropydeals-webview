import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCrops } from "../../redux/slices/cropSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Cropinformation = () => {
  const dispatch = useDispatch();
  const { crops, loading, error } = useSelector((state) => state.crops);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  return (
    <div className="p-4">
      {/* Section Title */}
      <h1 className="text-xl text-[#075A53] font-semibold">
        {t("crop Information")}
      </h1>

      {/* Loading & Error Messages */}
      {loading && <p>{t("loadingCrops")}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Crop List */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar mt-5">
        {crops.map((crop) => (
          <div
            key={crop._id}
            onClick={() => navigate(`/cropinfo/${crop._id}`)}
            className="flex flex-col items-center min-w-[80px] cursor-pointer"
          >
            <img
              src={crop.cropImage}
              alt={crop.cropName}
              className="w-20 h-20 rounded-full object-cover shadow-md"
            />
            <p className="mt-1 text-sm text-center capitalize text-[#075A53]">
              {crop.cropName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cropinformation;
