import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerLoginUser } from "./redux/slices/authSlice";
import CropInfoDynamic from "./components/cropinformation/Cropinfo";
import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";
import MyFarms from "./pages/MyFarms";
import CropgenBot from "./pages/CropgenBot";
import PreferredLanguage from "./pages/PreferredLanguage";
import AddField from "./pages/AddField";
import MandiRate from "./pages/Mandirates";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/add-field" element={<AddField />} />
        <Route path="/mandi-rates" element={<MandiRate />} />
        <Route path="/cropinfo/:id" element={<CropInfoDynamic />} />
        <Route path="/farm-details" element={<FarmDetails />} />
        <Route path="/my-farms" element={<MyFarms />} />
        cropgen-bot
        <Route path="/cropgen-bot" element={<CropgenBot />} />
        <Route path="/preferred-language" element={<PreferredLanguage />} />
      </Routes>
    </div>
  );
}

export default App;
