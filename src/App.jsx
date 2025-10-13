import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/farm-details" element={<FarmDetails />} />
            </Routes>
        </div>
    );
}

export default App;
