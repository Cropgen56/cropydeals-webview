import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getFarmFields } from "../redux/slices/farmSlice";
import farmBanner from "../assets/image/profilefarm.png";
import farmer from "../assets/farmer.png";
import FarmFieldCard from "../components/homepage/FarmFieldCard";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.user);
  const { fields } = useSelector((state) => state.farm);

  useEffect(() => {
    if (userData?.id) dispatch(getFarmFields(userData.id));
  }, [dispatch, userData?.id]);

  return (
    <div className="font-sans relative min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <div className="relative w-full h-[12rem] sm:h-[16rem] md:h-[18rem]">
        <img
          src={farmBanner}
          alt="Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 z-20 bg-[#075a53]/70 hover:bg-[#075a53] p-2 rounded-full text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Profile Picture */}
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 z-30">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={farmer}
              alt={t("profile")}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-[5rem] rounded-t-3xl px-4 pb-10 h-full max-w-[640px] mx-auto">
        {/* User Info */}
        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-[#075a53]">
            {userData?.firstName && userData?.lastName
              ? `${userData.firstName} ${userData.lastName}`
              : userData?.firstName || t("name")}
          </h2>
          <p className="text-gray-600 text-sm mt-1">{userData?.email}</p>
        </div>

        {/* Fields Section */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-3 text-black">
            {t("MyFarm")}
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {fields && fields.length > 0 ? (
              fields.map((field, idx) => (
                <FarmFieldCard
                  key={field._id || idx}
                  farmDetails={field}
                  cropName={field.cropName}
                  acre={field.acre}
                />
              ))
            ) : (
              <div className="text-gray-500 text-sm">
                {t("No Farms Available")}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm mt-10">
          <p>
            {t("copyright")} {new Date().getFullYear()} CropGen
          </p>
          <p className="mt-1">{t("version")}: 1.1.01</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
