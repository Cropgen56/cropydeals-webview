import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { formatDate } from "../../utils/formatDate";

const SATELLITE_API = `https://server.cropgenapp.com`;

// --- Helpers ---
const normalizeError = (err) => {
  if (err instanceof Error) return err;
  if (err && typeof err === "object") {
    try {
      const msg =
        (err.response &&
          (err.response.data?.message || JSON.stringify(err.response.data))) ||
        err.message ||
        JSON.stringify(err);
      return new Error(msg);
    } catch {
      return new Error("Unknown error");
    }
  }
  return new Error(String(err));
};

// initial state (no AdvisoryV2, no cache-related flags)
const initialState = {
  selectedIndex: "NDVI",
  datesData: [],
  indexData: null,
  cropHealth: null,
  newNpkData: null,
  cropGrowthStage: null,
  Advisory: null,
  cropYield: null,
  loading: false,
  error: null,
  isLoading: {
    index: false,
    Advisory: false,
    datesData: false,
    newNpkData: false,
    cropGrowthStage: false,
  },
};

// fetchDatesData
export const fetchDatesData = createAsyncThunk(
  "satellite/fetchDatesData",
  async (availabilityPayload, { rejectWithValue }) => {
    console.log(import.meta.env.VITE_SATELLITE_API);
    try {
      if (!availabilityPayload) {
        return rejectWithValue({ message: "Geometry is missing" });
      }
      const response = await axios.post(
        `${SATELLITE_API}/v4/api/availability/`,
        availabilityPayload,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_SATELLITE_API,
          },
        }
      );
      return response?.data ?? null;
    } catch (error) {
      const err = normalizeError(error);
      return rejectWithValue({ message: err.message });
    }
  }
);

// generateAdvisory (v1)
export const generateAdvisory = createAsyncThunk(
  "satellite/generateAdvisory",
  async (
    { farmDetails, currentWeather, SoilMoisture, bbchStage, language },

    { rejectWithValue }
  ) => {
    try {
      if (!farmDetails || !farmDetails._id) {
        return rejectWithValue({
          message: "Invalid farmDetails: Farm ID is missing",
        });
      }
      if (!currentWeather || typeof currentWeather !== "object") {
        return rejectWithValue({
          message: "currentWeather is required to generate advisory",
        });
      }

      const farmId = farmDetails._id;
      const lang = language || "en";

      const {
        cropName,
        sowingDate,
        variety,
        typeOfIrrigation: irrigation_type,
        typeOfFarming,
      } = farmDetails || {};
      if (!cropName || !sowingDate) {
        return rejectWithValue({
          message: "Missing required farm data: cropName or sowingDate",
        });
      }

      const formattedSowingDate = formatDate
        ? formatDate(sowingDate)
        : sowingDate;

      // Use currentWeather directly (no cached augmentation)
      const currentConditions = currentWeather || {};
      const stage = bbchStage || "BBCH 00";

      const payload = {
        crop_name: cropName,
        sowing_date: formattedSowingDate,
        bbch_stage: stage,
        variety: variety || "",
        irrigation_type: irrigation_type || "",
        humidity: Math.round(
          currentConditions.humidity ?? currentConditions.relative_humidity ?? 0
        ),
        temp: Math.round(
          currentConditions.temp ?? currentConditions.temperature ?? 0
        ),
        rain: Math.round(
          currentConditions.precipprob ??
            currentConditions.precipitation ??
            currentConditions.rain ??
            0
        ),
        soil_temp: Math.round(
          SoilMoisture?.data?.Soil_Temperature?.Soil_Temperature_max ?? 0
        ),
        soil_moisture: Math.round(
          SoilMoisture?.data?.Soil_Moisture?.Soil_Moisture_max ?? 0
        ),
        language: lang,
        type_of_farming: typeOfFarming || "",
      };
      const response = await axios.post(
        `${SATELLITE_API}/generate-advisory-crop`,
        payload,
        {
          headers: {
            "x-api-key": process.env.REACT_APP_SATELLITE_API,
          },
        }
      );
      return response?.data ?? null;
    } catch (error) {
      const err = normalizeError(error);
      return rejectWithValue({ message: err.message });
    }
  }
);

// fetchIndexData
export const fetchIndexData = createAsyncThunk(
  "satellite/fetchIndexData",
  async (
    { sowingDate, selectedDate, coordinates, selectedIndex },
    { rejectWithValue }
  ) => {
    try {
      if (!sowingDate || !selectedDate || !coordinates || !selectedIndex) {
        return rejectWithValue({ message: "Missing required parameters" });
      }
      if (!Array.isArray(coordinates) || coordinates.length === 0) {
        return rejectWithValue({ message: "Invalid or missing coordinates" });
      }

      const payload = {
        geometry: { type: "Polygon", coordinates },
        date: selectedDate,
        index_name: selectedIndex,
        provider: "both",
        satellite: "s2",
        width: 256,
        height: 256,
        supersample: 1,
        smooth: false,
        gaussian_sigma: 1,
      };

      const response = await axios.post(
        `${SATELLITE_API}/v4/api/calculate/index`,
        payload,
        {
          headers: {
            "x-api-key": import.meta.env.VITE_SATELLITE_API,
          },
        }
      );
      return response?.data ?? null;
    } catch (error) {
      const err = normalizeError(error);
      return rejectWithValue({ message: err.message });
    }
  }
);

// calculateAiYield
export const calculateAiYield = createAsyncThunk(
  "satellite/calculateAiYield",
  async ({ farmDetails, bbchStage }, { rejectWithValue }) => {
    try {
      if (!farmDetails || !farmDetails._id) {
        return rejectWithValue({
          message: "Invalid farmDetails: _id is missing",
        });
      }

      const { field = [], cropName } = farmDetails;
      if (!Array.isArray(field) || field.length === 0 || !cropName) {
        return rejectWithValue({ message: "Invalid field or cropName" });
      }

      const formattedCropName =
        cropName.charAt(0).toUpperCase() + cropName.slice(1).toLowerCase();

      const coordinates = field.map(({ lat, lng }) => [lng, lat]);

      const payload = {
        crop_name: formattedCropName,
        bbch_stage: bbchStage ?? 89,
        geometry: [coordinates],
      };

      const response = await axios.post(
        `${SATELLITE_API}/v2/api/ai-yield`,
        payload
      );

      return response?.data ?? null;
    } catch (error) {
      const err = normalizeError(error);
      return rejectWithValue({ message: err.message });
    }
  }
);

// fetchCropHealth
export const fetchCropHealth = createAsyncThunk(
  "satellite/cropHealth",
  async (polygonCoords, { rejectWithValue }) => {
    try {
      function unwrapCoordinates(coords) {
        if (
          Array.isArray(coords) &&
          coords.length === 1 &&
          Array.isArray(coords[0])
        ) {
          return coords[0];
        }
        return coords;
      }

      const coordinate = unwrapCoordinates(polygonCoords);
      const response = await axios.post(
        `https://server.cropgenapp.com/v2/api/crop-health`,
        {
          geometry: coordinate,
        }
      );

      return response?.data ?? null;
    } catch (error) {
      const err = normalizeError(error);
      return rejectWithValue({ message: err.message });
    }
  }
);

// getNpkData
export const getNpkData = createAsyncThunk(
  "satellite/getNpkData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${SATELLITE_API}/v2/api/calculate-npk`,
        payload
      );
      return response?.data ?? null;
    } catch (err) {
      const error = normalizeError(err);
      return rejectWithValue({
        message: error.message || "Failed to fetch new NPK data",
      });
    }
  }
);

// getTheCropGrowthStage
export const getTheCropGrowthStage = createAsyncThunk(
  "satellite/getTheCropGrowthStage",
  async (payload, { rejectWithValue }) => {
    try {
      if (!payload) return rejectWithValue({ message: "Payload is required" });

      const response = await axios.post(
        `${SATELLITE_API}/v2/api/bbch-stage`,
        payload
      );
      return response?.data ?? null;
    } catch (err) {
      const error = normalizeError(err);
      return rejectWithValue({
        message: error.message || "Failed to fetch crop growth stage",
      });
    }
  }
);

// ---------------- Slice ----------------
const satelliteSlice = createSlice({
  name: "satellite",
  initialState,
  reducers: {
    setSelectedIndex: (state, action) => {
      state.selectedIndex = action.payload;
    },
    resetState: (state) => {
      state.datesData = null;
      state.indexData = null;
      state.cropHealth = null;
      state.newNpkData = null;
      state.cropYield = null;
      state.cropGrowthStage = null;
      state.Advisory = null;
    },
    resetAdvisory: (state) => {
      state.Advisory = null;
      state.isLoading.Advisory = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    // fetchDatesData
    builder
      .addCase(fetchDatesData.pending, (state) => {
        state.isLoading.datesData = true;
      })
      .addCase(fetchDatesData.fulfilled, (state, action) => {
        state.isLoading.datesData = false;
        state.datesData = action.payload;
      })
      .addCase(fetchDatesData.rejected, (state, action) => {
        state.isLoading.datesData = false;
        state.error = action.payload;
      });

    // fetchIndexData
    builder
      .addCase(fetchIndexData.pending, (state) => {
        state.isLoading.index = true;
        state.error = null;
      })
      .addCase(fetchIndexData.fulfilled, (state, action) => {
        state.isLoading.index = false;
        state.indexData = action.payload;
      })
      .addCase(fetchIndexData.rejected, (state, action) => {
        state.isLoading.index = false;
        state.error = action.payload ?? action.error ?? null;
      });

    // calculateAiYield
    builder
      .addCase(calculateAiYield.pending, setPending)
      .addCase(calculateAiYield.fulfilled, (state, action) => {
        state.loading = false;
        state.cropYield = action.payload;
      })
      .addCase(calculateAiYield.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error ?? null;
      });

    // fetchCropHealth
    builder
      .addCase(fetchCropHealth.pending, setPending)
      .addCase(fetchCropHealth.fulfilled, (state, action) => {
        state.loading = false;
        state.cropHealth = action.payload;
      })
      .addCase(fetchCropHealth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error ?? null;
      });

    // generateAdvisory (v1)
    builder
      .addCase(generateAdvisory.pending, (state) => {
        state.isLoading.Advisory = true;
      })
      .addCase(generateAdvisory.fulfilled, (state, action) => {
        state.isLoading.Advisory = false;
        state.Advisory = action.payload;
      })
      .addCase(generateAdvisory.rejected, (state, action) => {
        state.isLoading.Advisory = false;
        state.error = action.payload ?? action.error ?? null;
      });

    // getNpkData
    builder
      .addCase(getNpkData.pending, (state) => {
        state.isLoading.newNpkData = true;
      })
      .addCase(getNpkData.fulfilled, (state, action) => {
        state.isLoading.newNpkData = false;
        state.newNpkData = action.payload;
      })
      .addCase(getNpkData.rejected, (state, action) => {
        state.isLoading.newNpkData = false;
        state.error = action.payload ?? action.error ?? null;
      });

    // getTheCropGrowthStage
    builder
      .addCase(getTheCropGrowthStage.pending, (state) => {
        state.isLoading.cropGrowthStage = true;
        state.error = null;
      })
      .addCase(getTheCropGrowthStage.fulfilled, (state, action) => {
        state.isLoading.cropGrowthStage = false;
        state.cropGrowthStage = action.payload;
      })
      .addCase(getTheCropGrowthStage.rejected, (state, action) => {
        state.isLoading.cropGrowthStage = false;
        state.error = action.payload ?? action.error ?? null;
      });
  },
});

export const { setSelectedIndex, resetState, resetAdvisory } =
  satelliteSlice.actions;

export default satelliteSlice.reducer;
