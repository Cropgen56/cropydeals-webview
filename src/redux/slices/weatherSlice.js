import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const OBSERVEARTH_API_KEY = "5b97d3f0-a01a-490b-aad1-3bfa848309f2";

// Fetch current weather from Observearth
export const fetchweatherData = createAsyncThunk(
  "weather/fetchweatherData",
  async ({ geometry_id }, { rejectWithValue }) => {
    if (!geometry_id) {
      return rejectWithValue(
        "geometry_id is required for Observearth current weather"
      );
    }
    try {
      const url = `https://observearth.com/api/weather/current/?geometry_id=${geometry_id}`;
      const response = await axios.get(url, {
        headers: { "X-API-Key": OBSERVEARTH_API_KEY },
      });

      const payload = response.data?.current ?? response.data;
      return payload;
    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
          error.message ||
          "Failed to fetch current weather"
      );
    }
  }
);

// Create AOI
export const createAOI = createAsyncThunk(
  "weather/createAOI",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const url = "https://observearth.com/api/geometry/";
      const response = await axios.post(url, payload, {
        headers: {
          "X-API-Key": OBSERVEARTH_API_KEY,
          "Content-Type": "application/json",
        },
      });

      // refresh AOIs list after create (background)
      dispatch(fetchAOIs());
      return response.data?.id ?? response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to create AOI"
      );
    }
  }
);

// Fetch AOIs
export const fetchAOIs = createAsyncThunk(
  "weather/fetchAOIs",
  async (_, { rejectWithValue }) => {
    try {
      const url = "https://observearth.com/api/geometry/?detail=false";
      const response = await axios.get(url, {
        headers: { "X-API-Key": OBSERVEARTH_API_KEY },
      });

      const aois = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];
      return aois;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch AOIs"
      );
    }
  }
);

// Fetch forecast (kept for other screens)
export const fetchForecastData = createAsyncThunk(
  "weather/fetchForecastData",
  async ({ geometry_id }, { rejectWithValue }) => {
    if (!geometry_id) return rejectWithValue("geometry_id required");
    try {
      const url = `https://observearth.com/api/weather/forecast/?geometry_id=${geometry_id}`;
      const response = await axios.get(url, {
        headers: { "X-API-Key": OBSERVEARTH_API_KEY },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch forecast data"
      );
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    currentWeather: null,
    forecastData: null,
    aois: [],
    aoiId: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearWeatherCache: (state) => {
      state.currentWeather = null;
      state.forecastData = null;
      state.aois = [];
      state.aoiId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchweatherData
      .addCase(fetchweatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchweatherData.fulfilled, (state, action) => {
        state.currentWeather = action.payload;
        state.loading = false;
      })
      .addCase(fetchweatherData.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.loading = false;
      })

      // createAOI
      .addCase(createAOI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAOI.fulfilled, (state, action) => {
        state.aoiId = action.payload;
        state.loading = false;
      })
      .addCase(createAOI.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.loading = false;
      })

      // fetchAOIs
      .addCase(fetchAOIs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAOIs.fulfilled, (state, action) => {
        state.aois = action.payload;
        state.loading = false;
      })
      .addCase(fetchAOIs.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.loading = false;
      })

      // fetchForecastData
      .addCase(fetchForecastData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecastData.fulfilled, (state, action) => {
        state.forecastData = action.payload;
        state.loading = false;
      })
      .addCase(fetchForecastData.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
        state.loading = false;
      });
  },
});

export const { clearWeatherCache } = weatherSlice.actions;
export default weatherSlice.reducer;
