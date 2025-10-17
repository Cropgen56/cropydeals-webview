import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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

  useEffect(() => {
    const lang = "en";
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);

    const phone = "+919876543210";
    const email = "john.doe@example.com";
    const firstName = "John";
    const lastName = "Doe";

    const existingToken = localStorage.getItem("accessToken");

    if (!existingToken && phone && email && firstName && lastName) {
      dispatch(registerLoginUser({ phone, email, firstName, lastName }));
    }
  }, [dispatch, i18n]);

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
