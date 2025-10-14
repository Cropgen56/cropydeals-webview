import React, { useState, useEffect } from "react";
import FarmImage from "../../assets/farm-field.png";
import {
  DeleteIcon,
  MyFarmColorIcon,
  UpdateIcon,
} from "../../assets/Icons";
import { useDispatch } from "react-redux";
import { deleteFarmField, updateFarmField } from "../../redux/slices/farmSlice";
import { useNavigate } from "react-router-dom";
import * as turf from "@turf/turf";

import { getCityState } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";

const UpdateFarmDetails = ({
  isOpen,
  toggleForm,
  setIsSubmitting,
  farmDetails,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate("/my-farms");
  const { t } = useTranslation();

  // fetch the user location data
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Calculate the centroid
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

  // Initialize state to hold field data
  const [field, setField] = useState({
    farmName: farmDetails?.fieldName,
    cropName: farmDetails?.cropName,
    sowingDate: farmDetails?.sowingDate,
    variety: farmDetails?.variety,
    irrigation: farmDetails?.typeOfIrrigation.replace(/ /g, "-").toLowerCase(),
    typeOfFarming: farmDetails?.typeOfFarming,
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setField({ ...field, [name]: value });
  };

  // Validate form fields and check data types
  const validateForm = () => {
    let valid = true;

    if (
      !field.farmName ||
      typeof field.farmName !== "string" ||
      field.farmName.trim() === ""
    ) {
      valid = false;
      alert("Farm Name is required and must be a string.");
    }

    if (!field.cropName) {
      valid = false;
      alert("Please select a crop.");
    }

    if (!field.sowingDate || isNaN(Date.parse(field.sowingDate))) {
      valid = false;
      alert("Sowing Date is required.");
    }

    if (
      !field.variety ||
      typeof field.variety !== "string" ||
      field.variety.trim() === ""
    ) {
      valid = false;
      alert("Variety is required .");
    }

    if (!field.irrigation) {
      valid = false;
      alert("Please select an irrigation type.");
    } else if (
      !["open-irrigation", "drip-irrigation", "sprinkler"].includes(
        field.irrigation
      )
    ) {
      valid = false;
      alert("Invalid irrigation type selected.");
    }

    return valid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form data
    if (validateForm()) {
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
        if (res?.payload?.success) {
          setIsSubmitting(false);
          alert("Farm added successfully");
          const farmDetails = res?.payload?.farmField;
          navigate("/farm-details", { state: farmDetails });
        }
      });
    } else {
      console.log("Form validation failed");
    }
  };

  const handelDelete = () => {
    dispatch(deleteFarmField({ farmId: farmDetails?._id })).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      {/* Sliding Form */}
      <div
        className={`fixed left-0 w-[90%] bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.2)] rounded-t-xl transition-all duration-300 ease-in-out p-5 z-[1000] ${
          isOpen ? "bottom-0" : "-bottom-full"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex w-[70%]">
            <div className="mr-[0.3rem]">
              <MyFarmColorIcon />
            </div>
            <div>
              <h3 className="m-0 text-2xl">My Farm</h3>
              <p className="m-0 text-gray-500 text-sm">
                {city}, {state}
              </p>
            </div>
          </div>
          <button className="bg-transparent border-none text-black text-2xl cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row gap-5">
          {/* Left Image Section */}
          <div className="md:flex-1 md:max-w-[40%]">
            <img src={FarmImage} alt="Farm" className="w-full h-auto" />
          </div>

          {/* Right Form Section */}
          <form className="flex flex-col md:flex-[2] md:ml-5" onSubmit={handleSubmit}>
            {/* Farm Name */}
            <label htmlFor="farmName" className="mb-0.5 text-sm text-[#9a9898]">
              {t("farm_name")}
            </label>
            <input
              type="text"
              id="farmName"
              name="farmName"
              value={field.farmName}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            />
            
            {/* cropName */}
            <label htmlFor="cropName" className="mb-0.5 text-sm text-[#9a9898]">
              {t("cropName")}
            </label>
            <select
              id="cropName"
              name="cropName"
              value={field.cropName}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            >
              <option value="" disabled>
                {t("select_crop")}
              </option>
              <option value="Barley">{t("barley")}</option>
              <option value="Wheat">{t("wheat")}</option>
              <option value="PearlMillet">{t("pearl_millet")}</option>
              <option value="Sorghum">{t("sorghum")}</option>
              <option value="FingerMillet">{t("finger_millet")}</option>
              <option value="Chickpea">{t("chickpea")}</option>
              <option value="RedGram">{t("red_gram")}</option>
              <option value="GreenGram">{t("green_gram")}</option>
              <option value="BlackGram">{t("black_gram")}</option>
              <option value="Lentil">{t("lentil")}</option>
              <option value="FieldPea">{t("field_pea")}</option>
              <option value="HorseGram">{t("horse_gram")}</option>
              <option value="Cowpea">{t("cowpea")}</option>
              <option value="Groundnut">{t("groundnut")}</option>
              <option value="Mustard">{t("mustard")}</option>
              <option value="Soybean">{t("soybean")}</option>
              <option value="Sunflower">{t("sunflower")}</option>
              <option value="Sesame">{t("sesame")}</option>
              <option value="Linseed">{t("linseed")}</option>
              <option value="Castor">{t("castor")}</option>
              <option value="Safflower">{t("safflower")}</option>
              <option value="Niger">{t("niger")}</option>
              <option value="Sugarcane">{t("sugarcane")}</option>
              <option value="Cotton">{t("cotton")}</option>
              <option value="Jute">{t("jute")}</option>
              <option value="Tobacco">{t("tobacco")}</option>
              <option value="Potato">{t("potato")}</option>
              <option value="Tomato">{t("tomato")}</option>
              <option value="Brinjal">{t("brinjal")}</option>
              <option value="Cabbage">{t("cabbage")}</option>
              <option value="Cauliflower">{t("cauliflower")}</option>
              <option value="Onion">{t("onion")}</option>
              <option value="Garlic">{t("garlic")}</option>
              <option value="Okra">{t("okra")}</option>
              <option value="Carrot">{t("carrot")}</option>
              <option value="Radish">{t("radish")}</option>
              <option value="Spinach">{t("spinach")}</option>
              <option value="Methi">{t("methi")}</option>
              <option value="GreenPeas">{t("green_peas")}</option>
              <option value="BitterGourd">{t("bitter_gourd")}</option>
              <option value="BottleGourd">{t("bottle_gourd")}</option>
              <option value="Pumpkin">{t("pumpkin")}</option>
              <option value="Cucumber">{t("cucumber")}</option>
              <option value="Beans">{t("beans")}</option>
              <option value="Mango">{t("mango")}</option>
              <option value="Banana">{t("banana")}</option>
              <option value="Guava">{t("guava")}</option>
              <option value="Apple">{t("apple")}</option>
              <option value="Papaya">{t("papaya")}</option>
              <option value="Orange">{t("orange")}</option>
              <option value="Lemon">{t("lemon")}</option>
              <option value="Pomegranate">{t("pomegranate")}</option>
              <option value="Grapes">{t("grapes")}</option>
              <option value="Pineapple">{t("pineapple")}</option>
              <option value="Watermelon">{t("watermelon")}</option>
              <option value="Muskmelon">{t("muskmelon")}</option>
              <option value="Turmeric">{t("turmeric")}</option>
              <option value="Ginger">{t("ginger")}</option>
              <option value="Coriander">{t("coriander")}</option>
              <option value="Cumin">{t("cumin")}</option>
              <option value="BlackPepper">{t("black_pepper")}</option>
              <option value="RedChilies">{t("red_chilies")}</option>
              <option value="Tea">{t("tea")}</option>
              <option value="Coffee">{t("coffee")}</option>
              <option value="Coconut">{t("coconut")}</option>
              <option value="Arecanut">{t("arecanut")}</option>
              <option value="Rubber">{t("rubber")}</option>
              <option value="DragonFruit">{t("dragon_fruit")}</option>
              <option value="SpongeGourd">{t("sponge_gourd")}</option>
              <option value="SnakeGourd">{t("snake_gourd")}</option>
              <option value="AshGourd">{t("ash_gourd")}</option>
              <option value="Drumstick">{t("drumstick")}</option>
              <option value="Chili">{t("chili")}</option>
              <option value="Chia">{t("chia")}</option>
              <option value="Rice">{t("rice")}</option>
              <option value="Kiwi">{t("kiwi")}</option>
              <option value="Amla">{t("amla")}</option>
              <option value="Capsicum">{t("capsicum")}</option>
              <option value="Carrot">{t("carrot")}</option>
              <option value="Other">{t("other")}</option>
            </select>
            
            {/* Sowing Date */}
            <label htmlFor="sowingDate" className="mb-0.5 text-sm text-[#9a9898]">
              {t("sowing_date")}
            </label>
            <input
              type="date"
              id="sowingDate"
              name="sowingDate"
              value={field.sowingDate}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            />
            
            {/* Variety */}
            <label htmlFor="variety" className="mb-0.5 text-sm text-[#9a9898]">
              {t("variety")}
            </label>
            <input
              type="text"
              id="variety"
              name="variety"
              value={field.variety}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            />
            
            {/* Type of Irrigation */}
            <label htmlFor="irrigation" className="mb-0.5 text-sm text-[#9a9898]">
              {t("type_of_irrigation")}
            </label>
            <select
              id="irrigation"
              name="irrigation"
              value={field.irrigation}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            >
              <option value="drip-irrigation">{t("drip_irrigation")}</option>
              <option value="sprinkler">{t("sprinkler")}</option>
              <option value="open-irrigation">{t("open_irrigation")}</option>
            </select>
            
            {/* Type of Farming */}
            <label htmlFor="farming" className="mb-0.5 text-sm text-[#9a9898]">
              {t("type_of_farming")}
            </label>
            <select
              id="farming"
              name="typeOfFarming"
              value={field.typeOfFarming}
              onChange={handleInputChange}
              className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px]"
            >
              <option value="" disabled>
                {t("select_farming")}
              </option>
              <option value="Inorganic">{t("inorganic")}</option>
              <option value="Integrated">{t("integrated")}</option>
              <option value="Organic">{t("organic")}</option>
            </select>
          </form>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-between mt-2">
          <button
            type="submit"
            className="w-[47%] p-2.5 bg-[rgb(206,7,7)] text-white text-base border-none rounded-[5px] cursor-pointer font-semibold flex justify-center items-center"
            onClick={handelDelete}
          >
            <DeleteIcon />
            {t("delete_farm")}
          </button>
          <button
            type="submit"
            className="w-[47%] p-2.5 bg-[#075a53] text-white text-base border-none rounded-[5px] cursor-pointer font-semibold flex justify-center items-center hover:bg-[#075a53]"
            onClick={handleSubmit}
          >
            <UpdateIcon />
            {t("update_farm")}
          </button>
        </div>
      </div>
    </>
  );
};

export default UpdateFarmDetails;