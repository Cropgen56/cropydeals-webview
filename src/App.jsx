import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerLoginUser } from "./redux/slices/authSlice";

import Homepage from "./pages/Homepage";
import FarmDetails from "./pages/FarmDetails";
import AddField from "./pages/AddField";
import Cropinformation from "./components/cropinformation/Cropinformation";
import MandiRates from "./pages/Mandirates";
import CropInfoDynamic from "./components/cropinformation/Cropinfo";
// import NavigationBar from "./components/homepage/NavigationBar";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function App() {
  const dispatch = useDispatch();
  const query = useQuery();

  useEffect(() => {
    // const phone = query.get("phone");
    // const email = query.get("email");
    // const firstName = query.get("firstName");
    // const lastName = query.get("lastName");

    const phone = "+919876543210";
    const email = "john.doe@example.com";
    const firstName = "John";
    const lastName = "Doe";

    const existingToken = localStorage.getItem("accessToken");
    if (!existingToken && phone && email && firstName && lastName) {
      dispatch(registerLoginUser({ phone, email, firstName, lastName }));
    }
  }, [dispatch, query]);

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/farm-details" element={<FarmDetails />} />
          <Route path="/add-field" element={<AddField />} />
          <Route path="/crop-information" element={<Cropinformation />} />
          <Route path="/mandi-rates" element={<MandiRates />} />
          <Route path="/cropinfo/:id" element={<CropInfoDynamic />} />
        </Routes>
      </div>
      <div>
        {/* <NavigationBar /> */}
      </div>
    </>
  );
}

export default App;
