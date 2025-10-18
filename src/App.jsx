import React, { useEffect } from "react";
import { Routes, Route, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerLoginUser } from "./redux/slices/authSlice";
import { useTranslation } from "react-i18next";

// Pages
import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";
import MyFarms from "./pages/MyFarms";
import CropgenBot from "./pages/CropgenBot";
import PreferredLanguage from "./pages/PreferredLanguage";
import AddField from "./pages/AddField";
import MandiRates from "./pages/Mandirates";
import Cropinformation from "./components/cropinformation/Cropinformation";
import CropInfoDynamic from "./components/cropinformation/Cropinfo";
import Profile from "./pages/Profile";

function App() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();


  useEffect(() => {
    // const lang = "en";
    const lang = localStorage.getItem("language") || "en";

    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    let phone = searchParams.get("phone")?.trim();
    const email = searchParams.get("email")?.trim();
    const firstName = searchParams.get("firstName")?.trim();
    const lastName = searchParams.get("lastName")?.trim();

    // Validation functions
    const isValidPhone = (num) => /^\+?\d{10,15}$/.test(num);
    const isValidEmail = (mail) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    const isValidName = (name) => /^[A-Za-z\s]+$/.test(name);

    // Normalize phone format
    if (phone) {
      phone = phone.trim();
      if (!phone.startsWith("+")) {
        if (phone.startsWith("91")) {
          phone = `+${phone}`;
        } else {
          phone = `+91${phone.replace(/^0+/, "")}`;
        }
      }
    }

    // const existingToken = localStorage.getItem("accessToken");

    if (phone && email && firstName && lastName) {
      // Validate inputs
      if (!phone || !isValidPhone(phone)) {
        console.error("❌ Invalid phone number format:", phone);
        return;
      }

      if (!email || !isValidEmail(email)) {
        console.error("❌ Invalid email format:", email);
        return;
      }

      if (!firstName || !isValidName(firstName)) {
        console.error("❌ Invalid first name:", firstName);
        return;
      }

      if (!lastName || !isValidName(lastName)) {
        console.error("❌ Invalid last name:", lastName);
        return;
      }

       // Clear old token to replace with new login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      // console.log("Params received:", { phone, email, firstName, lastName });
      dispatch(registerLoginUser({ phone, email, firstName, lastName }));
      navigate("/", { replace: true });
    }
  }, [dispatch, i18n, searchParams, navigate]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/crop-information" element={<Cropinformation />} />
        <Route path="/mandi-rates" element={<MandiRates />} />
        <Route path="/cropinfo/:id" element={<CropInfoDynamic />} />
        <Route path="/my-farms" element={<MyFarms />} />
        <Route path="/cropgen-bot" element={<CropgenBot />} />
        <Route path="/preferred-language" element={<PreferredLanguage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
