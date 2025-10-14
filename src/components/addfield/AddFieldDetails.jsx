import React, { useId, useState, useEffect } from "react";
import FarmImage from "../../assets/farm-image.jpg";
import { MyFarmColorIcon } from "../../assets/Icons";
import { useDispatch } from "react-redux";
import { addFarmField } from "../../redux/slices/farmSlice";
import { useNavigate } from "react-router-dom";
import * as turf from "@turf/turf";
import { getCurrentLocation } from "../../utils/getUserCurrectCoordinate";
import { getCityState } from "../../utils/getUserLocation";
import { useTranslation } from "react-i18next";

const AddFieldDetails = ({
    isOpen,
    toggleForm,
    fieldCoordinate,
    setIsSubmitting,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate("/my-farms");

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

    const userData = JSON.parse(localStorage.getItem("userData"));

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

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form data
        if (validateForm()) {
            setIsSubmitting(true);
            dispatch(
                addFarmField({
                    latlng: fieldCoordinate,
                    userId: userData?._id,
                    cropName: field.cropName,
                    variety: field.variety,
                    sowingDate: field.sowingDate,
                    typeOfIrrigation: field.irrigation,
                    farmName: field.farmName,
                    acre: calculateArea(fieldCoordinate),
                    typeOfFarming: field.typeOfFarming,
                })
            ).then((res) => {
                if (res?.payload?.success) {
                    setIsSubmitting(false);
                    alert("Farm added successfully");
                    const farmDetails = res?.payload?.farmField;
                    toggleForm(); // Close the form after successful save
                    navigate("/farm-details", { state: farmDetails });
                }
            });
        } else {
            console.log("Form validation failed");
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
    ${isOpen
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

                        {/* The form now wraps all inputs and the submit button */}
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
                                        {t("farm_name")}
                                    </label>
                                    <input
                                        type="text"
                                        id="farmName"
                                        name="farmName"
                                        value={field.farmName}
                                        onChange={handleInputChange}
                                        className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                                    />

                                    {/* cropName */}
                                    <label
                                        htmlFor="cropName"
                                        className="mb-0.5 text-[0.9rem] text-[#9a9898]"
                                    >
                                        {t("cropName")}
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
                                        {/* ... crop options ... */}
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
                                        className="mb-[5px] p-[5px] border-[1.5px] border-[#075a53] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#075a53]"
                                    />

                                    {/* Type of Irrigation */}
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
                                        <option value="drip-irrigation">{t("drip_irrigation")}</option>
                                        <option value="sprinkler">{t("sprinkler")}</option>
                                        <option value="open-irrigation">{t("open_irrigation")}</option>
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
                            {/* Save Button */}
                            <button
                                type="submit" // Correctly triggers the form's onSubmit
                                className="w-full p-2.5 bg-[#075a53] text-white text-base border-none rounded-[5px] cursor-pointer font-semibold hover:bg-[#064d47] transition-colors mt-4"
                            >
                                {t("save_farm")}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddFieldDetails;