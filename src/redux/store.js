import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import satelliteReducer from "./slices/satelliteSlice";
import cropsReducer from "./slices/cropSlice";
import mandiReducer from "./slices/mandiSlice";
import authReducer from "./slices/authSlice"

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    satellite: satelliteReducer,
    crops: cropsReducer,
    mandi: mandiReducer,
    auth: authReducer,
  },
});

export default store;
