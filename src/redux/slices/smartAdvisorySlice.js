import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://server.cropgenapp.com/v2/api";

export const runSmartAdvisory = createAsyncThunk(
  "smartAdvisory/runSmartAdvisory",
  async ({ fieldId, geometryId, targetDate, language }, thunkAPI) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/advisory/${fieldId}/advisory/run`,
        {
          geometryId,
          targetDate,
          language,
        }
      );
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchSmartAdvisory = createAsyncThunk(
  "smartAdvisory/fetchSmartAdvisory",
  async ({ fieldId }, thunkAPI) => {
    try {
      const res = await apiClient.get(`${BASE_URL}/farm-adviosry/${fieldId}`);
      return res.data.advisories?.[0] || null;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

const smartAdvisorySlice = createSlice({
  name: "smartAdvisory",
  initialState: {
    loading: false,
    advisory: null,
    error: null,
  },
  reducers: {
    clearSmartAdvisory(state) {
      state.advisory = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run AI advisory
      .addCase(runSmartAdvisory.pending, (s) => {
        s.loading = true;
      })
      .addCase(runSmartAdvisory.fulfilled, (s, a) => {
        s.loading = false;
        s.advisory = a.payload;
      })
      .addCase(runSmartAdvisory.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      // Fetch advisory
      .addCase(fetchSmartAdvisory.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchSmartAdvisory.fulfilled, (s, a) => {
        s.loading = false;
        s.advisory = a.payload;
      })
      .addCase(fetchSmartAdvisory.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export const { clearSmartAdvisory } = smartAdvisorySlice.actions;
export default smartAdvisorySlice.reducer;
