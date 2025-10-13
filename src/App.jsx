import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";
import MyFarms from "./pages/MyFarms";
import CropgenBot from "./pages/CropgenBot";
import PreferredLanguage from "./pages/PreferredLanguage";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/farm-details" element={<FarmDetails />} />
                <Route path="/my-farms" element={<MyFarms />} />cropgen-bot
                <Route path="/cropgen-bot" element={<CropgenBot />} />
                <Route path="/preferred-language" element={<PreferredLanguage />} />
            </Routes>
        </div>
    );
}

export default App;
