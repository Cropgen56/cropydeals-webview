import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import satelliteReducer from "./slices/satelliteSlice";

const store = configureStore({
  reducer: {
    weather: weatherReducer,
    satellite: satelliteReducer,
  },
});

export default store;
