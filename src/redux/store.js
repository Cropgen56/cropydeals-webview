import {configureStore} from '@reduxjs/toolkit';
import satelliteReducer from './slices/satelliteSlice';

const store = configureStore({
  reducer: {
    satellite: satelliteReducer,
  },
});

export default store;
