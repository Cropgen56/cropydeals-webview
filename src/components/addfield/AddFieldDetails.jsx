import React, { useId, useState, useEffect } from "react";
import FarmImage from "../../assets/farm-image.jpg";
import { MyFarmColorIcon } from "../../assets/Icons";
import { useDispatch, useSelector } from "react-redux";
import { addFarmField } from "../../redux/slices/farmSlice";
import { useNavigate } from "react-router-dom";
import * as turf from "@turf/turf";
import { getCurrentLocation } from "../../utils/getUserCurrectCoordinate";
import { getCityState } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";
import { fetchCrops } from "../../redux/slices/cropSlice";

const AddFieldDetails = ({
  isOpen,
  toggleForm,
  fieldCoordinate,
  setIsSubmitting,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const crops = useSelector((state) => state.crops.crops);
  const cropsLoading = useSelector((state) => state.crops.loading);

  useEffect(() => {
    dispatch(fetchCrops());
  }, [dispatch]);

  const { t } = useTranslation();
  // fetch the user location data
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    // Fetch user's current location and update city/state
    getCurrentLocation({
      setLocation: (loc) => {
        setLocation(loc);
        if (loc?.latitude && loc?.longitude) {
          getCityState({
            lat: loc.latitude,
            lng: loc.longitude,
            setCity,
            setState,
          });
        }
      },
    });
  }, []);

  const userData = useSelector((state) => state.auth.user);

  // Initialize state to hold field data
  const [field, setField] = useState({
    farmName: "",
    cropName: "",
    sowingDate: "",
    variety: "",
    irrigation: "",
    typeOfFarming: "",
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

    if (!field.typeOfFarming) {
      valid = false;
      alert("Please select a Type of Farming.");
    }

    return valid;
  };

  // calculate the farm in acer
  const calculateArea = (corrdinatesPoint) => {
    const coordinates = corrdinatesPoint.map((point) => [point.lng, point.lat]);
    coordinates.push(coordinates[0]);
    const polygon = turf.polygon([coordinates]);
    const area = turf.area(polygon);

    return area / 4046.86;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const irrigationMapping = {
        "drip-irrigation": "Drip",
        sprinkler: "Sprinkler",
        "open-irrigation": "Open",
      };

      const res = await dispatch(
        addFarmField({
          latlng: fieldCoordinate,
          userId: userData?.id,
          farmName: field.farmName,
          cropName: field.cropName,
          variety: field.variety,
          sowingDate: field.sowingDate,
          typeOfIrrigation: irrigationMapping[field.irrigation],
          acre: calculateArea(fieldCoordinate),
          typeOfFarming: field.typeOfFarming,
        })
      ).unwrap();

      if (res?.success) {
        alert("Farm added successfully!");
        setIsSubmitting(false);
        toggleForm();
        navigate("/my-farms");
      } else {
        alert(res?.message || "Something went wrong!");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Add farm field error:", err);
      alert(err?.message || "Failed to add farm field");
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
                  <h3 className="m-0 text-2xl">{t("farm_name")}</h3>
                  <p className="m-0 text-gray-500 text-[0.9rem]">
                    {city}, {state}
                  </p>
                </div>
              </div>
              <button
                className="bg-transparent border-none text-black text-2xl cursor-pointer hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                onClick={toggleForm}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Content Section */}
              <div className="flex justify-between gap-5  mt-5 ">
                {/* Left Image Section */}
                <div className="">
                  <img
                    src={FarmImage}
                    alt="Farm"
                    className="w-full h-full rounded-lg"
                  />
                </div>

                {/* Right Form Section */}
                <div className="flex flex-col md:flex-[2] md:ml-5">
                  {/* Farm Name */}
                  <label
                    htmlFor="farmName"
                    className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                  >
                    Farm Name
                  </label>
                  <input
                    type="text"
                    id="farmName"
                    name="farmName"
                    value={field.farmName}
                    onChange={handleInputChange}
                    placeholder="Type farm name"
                    className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                  />

                  {/* cropName */}
                  <label
                    htmlFor="cropName"
                    className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                  >
                    Crop Name
                  </label>
                  <select
                    id="cropName"
                    name="cropName"
                    value={field.cropName}
                    onChange={handleInputChange}
                    className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                  >
                    {cropsLoading && (
                      <option value="" disabled>
                        Loading crops...
                      </option>
                    )}
                    {crops &&
                      [...crops]
                        .sort((a, b) => a.cropName.localeCompare(b.cropName))
                        .map((crop) => (
                          <option key={crop._id} value={crop.cropName}>
                            {crop.cropName}
                          </option>
                        ))}
                  </select>

                  {/* Sowing Date */}
                  <label
                    htmlFor="sowingDate"
                    className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                  >
                    Sowing Date
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
                    Variety
                  </label>
                  <input
                    type="text"
                    id="variety"
                    name="variety"
                    value={field.variety}
                    onChange={handleInputChange}
                    placeholder="Type Variety"
                    className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                  />

                  {/* Type of Irrigation */}
                  <label
                    htmlFor="irrigation"
                    className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                  >
                    Type of irrigation
                  </label>
                  <select
                    id="irrigation"
                    name="irrigation"
                    value={field.irrigation}
                    onChange={handleInputChange}
                    className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                  >
                    <option value="" disabled>
                      Select Irrigation
                    </option>
                    <option value="drip-irrigation">Drip-irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="open-irrigation">Open-irrigation</option>
                  </select>

                  {/* Type of Farming */}
                  <label
                    htmlFor="farming"
                    className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                  >
                    Type of farming
                  </label>
                  <select
                    id="farming"
                    name="typeOfFarming"
                    value={field.typeOfFarming}
                    onChange={handleInputChange}
                    className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                  >
                    <option value="" disabled>
                      Select Farming
                    </option>
                    <option value="Organic">Organic</option>
                    <option value="Inorganic">Inorganic</option>
                    <option value="Integrated">Integrated</option>
                  </select>
                </div>
              </div>
              {/* Save Button */}
              <button
                type="submit"
                className="w-full p-2.5 bg-[#075a53] text-white text-base border-none rounded-[5px] font-semibold hover:bg-[#064d47] transition-all ease-in-out duration-500 cursor-pointer mt-4"
              >
                Save Farm
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFieldDetails;
