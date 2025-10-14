import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const LIST_API_URL = "https://server.cropgenapp.com/v1/api/crop/get-crop-list";
const SINGLE_CROP_API_URL = "https://server.cropgenapp.com/v1/api/crop/get/";

export const fetchCrops = createAsyncThunk(
  "crops/fetchCrops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(LIST_API_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch crops"
      );
    }
  }
);

export const fetchCropById = createAsyncThunk(
  "crops/fetchCropById",
  async (cropId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${SINGLE_CROP_API_URL}${cropId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch crop details"
      );
    }
  }
);

const cropsSlice = createSlice({
  name: "crops",
  initialState: {
    crops: [],
    selectedCrop: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCrops: (state) => {
      state.crops = [];
    },
    clearSelectedCrop: (state) => {
      state.selectedCrop = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // All crops
      .addCase(fetchCrops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCrops.fulfilled, (state, action) => {
        state.loading = false;
        state.crops = action.payload;
      })
      .addCase(fetchCrops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Single crop
      .addCase(fetchCropById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedCrop = null;
      })
      .addCase(fetchCropById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCrop = action.payload;
      })
      .addCase(fetchCropById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCrops, clearSelectedCrop } = cropsSlice.actions;
export default cropsSlice.reducer;
