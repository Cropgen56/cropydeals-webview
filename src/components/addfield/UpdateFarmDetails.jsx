import React, { useState, useEffect } from "react";
import FarmImage from "../../assets/farm-field.png";
import { MyFarmColorIcon } from "../../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteFarmField, updateFarmField } from "../../redux/slices/farmSlice";
import { useNavigate } from "react-router-dom";
import { getCityState } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";
import { RefreshCcw, Trash2 } from "lucide-react";
import { fetchCrops } from "../../redux/slices/cropSlice";

const UpdateFarmDetails = ({
  isOpen,
  toggleForm,
  setIsSubmitting,
  farmDetails,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate("/my-farms");
  const { t } = useTranslation();

  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const crops = useSelector((state) => state.crops.crops);
  const cropsLoading = useSelector((state) => state.crops.loading);

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  // Calculate centroid for city/state
  const centroid = farmDetails?.field?.reduce(
    (acc, point) => {
      acc.lat += point.lat;
      acc.lng += point.lng;
      return acc;
    },
    { lat: 0, lng: 0 }
  );

  centroid.lat /= farmDetails?.field?.length;
  centroid.lng /= farmDetails?.field?.length;

  useEffect(() => {
    if (centroid) {
      getCityState({
        lat: centroid.lat,
        lng: centroid.lng,
        setCity,
        setState,
      });
    }
  }, [centroid]);

  const [field, setField] = useState({
    farmName: farmDetails?.fieldName || "",
    cropName: farmDetails?.cropName || "",
    sowingDate: farmDetails?.sowingDate || "",
    variety: farmDetails?.variety || "",
    irrigation: farmDetails?.typeOfIrrigation || "",
    typeOfFarming: farmDetails?.typeOfFarming || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setField({ ...field, [name]: value });
  };

  const validateForm = () => {
    let valid = true;
    if (!field.farmName.trim()) {
      alert(t("farm_name_required"));
      valid = false;
    }
    if (!field.cropName) {
      alert(t("please_select_crop"));
      valid = false;
    }
    if (!field.sowingDate) {
      alert(t("sowing_date_required"));
      valid = false;
    }
    if (!field.variety.trim()) {
      alert(t("variety_required"));
      valid = false;
    }
    if (!field.irrigation) {
      alert(t("please_select_irrigation_type"));
      valid = false;
    }
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    dispatch(
      updateFarmField({
        cropName: field.cropName,
        variety: field.variety,
        sowingDate: field.sowingDate,
        typeOfIrrigation: field.irrigation,
        fieldName: field.farmName,
        farmId: farmDetails?._id,
        typeOfFarming: field.typeOfFarming,
      })
    ).then((res) => {
      setIsSubmitting(false);
      if (res?.payload?.success) {
        alert(t("farm_updated_successfully"));
        navigate("/my-farms");
      } else {
        alert(t("something_went_wrong"));
      }
    });
  };

  // Helper to capitalize each word
  const capitalizeWords = (str) =>
    str
      .toLowerCase()
      .split(/[\s_]+/) // Split on space or underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  const handleDelete = () => {
    dispatch(deleteFarmField({ farmId: farmDetails?._id })).then(() => {
      alert(t("farm_deleted_successfully"));
      navigate("/");
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 bg-opacity-50 z-[3999] flex items-end justify-center transition-opacity duration-300"
      onClick={toggleForm}
    >
      <div
        className={`bg-white rounded-t-xl w-full max-w-[800px] shadow-2xl 
                    fixed bottom-0 left-1/2 -translate-x-1/2
                    h-fit max-h-screen
                    transform transition-all duration-500 ease-out
                    ${
                      isOpen
                        ? "translate-y-0 opacity-100"
                        : "translate-y-full opacity-0"
                    }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div className="flex w-[70%]">
              <div className="mr-[0.3rem]">
                <MyFarmColorIcon />
              </div>
              <div>
                <h3 className="m-0 text-2xl">{t("update_farm")}</h3>
                <p className="m-0 text-gray-500 text-[0.9rem]">
                  {city}, {state}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="bg-transparent border-none text-black text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              onClick={() => {
                toggleForm();
                navigate("/my-farms");
              }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-between gap-2 mt-5">
              {/* Left Image */}
              <div>
                <img
                  src={FarmImage}
                  alt={t("farm_name")}
                  className="w-full h-full rounded-lg"
                />
              </div>

              {/* Right Form */}
              <div className="flex flex-col md:flex-[2] md:ml-5">
                {/* Farm Name */}
                <label
                  htmlFor="farmName"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("farm_name")}
                </label>
                <input
                  type="text"
                  id="farmName"
                  name="farmName"
                  value={field.farmName}
                  onChange={handleInputChange}
                  placeholder={t("farm_name")}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                />

                {/* Crop Name */}
                <label
                  htmlFor="cropName"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("crop_name")}
                </label>
                <select
                  id="cropName"
                  name="cropName"
                  value={field.cropName}
                  onChange={handleInputChange}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                >
                  <option value="" disabled>
                    {t("select_crop")}
                  </option>
                  {cropsLoading && (
                    <option value="" disabled>
                      {t("loading_crops")}
                    </option>
                  )}

                  {crops &&
                    [...crops]
                      .sort((a, b) => a.cropName.localeCompare(b.cropName))
                      .map((crop) => (
                        <option key={crop._id} value={crop.cropName}>
                          {capitalizeWords(crop.cropName)}
                        </option>
                      ))}
                </select>

                {/* Sowing Date */}
                <label
                  htmlFor="sowingDate"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("sowing_date")}
                </label>
                <input
                  type="date"
                  id="sowingDate"
                  name="sowingDate"
                  value={field.sowingDate}
                  onChange={handleInputChange}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                />

                {/* Variety */}
                <label
                  htmlFor="variety"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("variety")}
                </label>
                <input
                  type="text"
                  id="variety"
                  name="variety"
                  value={field.variety}
                  onChange={handleInputChange}
                  placeholder={t("variety")}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                />

                {/* Irrigation */}
                <label
                  htmlFor="irrigation"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("type_of_irrigation")}
                </label>
                <select
                  id="irrigation"
                  name="irrigation"
                  value={field.irrigation}
                  onChange={handleInputChange}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                >
                  <option value="" disabled>
                    {t("select_irrigation")}
                  </option>
                  {["drip-irrigation", "sprinkler", "open-irrigation"].map(
                    (val) => (
                      <option key={val} value={val}>
                        {val
                          .replace(/-/g, " ")
                          .split(" ")
                          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                          .join(" ")}
                      </option>
                    )
                  )}
                </select>

                {/* Type of Farming */}
                <label
                  htmlFor="farming"
                  className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                >
                  {t("type_of_farming")}
                </label>
                <select
                  id="farming"
                  name="typeOfFarming"
                  value={field.typeOfFarming}
                  onChange={handleInputChange}
                  className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                >
                  <option value="" disabled>
                    {t("select_farming")}
                  </option>
                  <option value="Organic">{t("organic")}</option>
                  <option value="Inorganic">{t("inorganic")}</option>
                  <option value="Integrated">{t("integrated")}</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1 w-full p-2.5 bg-red-600 text-white text-base border-none rounded-[5px] font-semibold hover:bg-red-700 transition-all ease-in-out duration-500 cursor-pointer"
              >
                <Trash2 size={24} color="#fff" /> {t("delete_farm")}
              </button>

              <button
                type="submit"
                className="flex items-center gap-1 w-full p-2.5 bg-[#075a53] text-white text-base border-none rounded-[5px] font-semibold hover:bg-[#064d47] transition-all ease-in-out duration-500 cursor-pointer"
              >
                <RefreshCcw size={24} color="#fff" /> {t("update_farm")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateFarmDetails;
