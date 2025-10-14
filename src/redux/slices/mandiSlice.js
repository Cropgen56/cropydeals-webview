import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const MANDI_API_BASE_URL =
  'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

// Thunk
export const getMandiPrices = createAsyncThunk(
  'mandi/getMandiPrices',
  async ({ cropName }, { rejectWithValue }) => {
    try {
      const params = { format: 'json', 'filters[commodity]': cropName, offset: 0, limit: 10 };
      const response = await axios.get(MANDI_API_BASE_URL, { params });
      return response.data.records || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mandi prices');
    }
  }
);

const mandiSlice = createSlice({
  name: 'mandi',
  initialState: {
    mandiPrices: [],
    loading: { mandiPrices: false },
    error: null,
  },
  reducers: {
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(getMandiPrices.pending, state => { state.loading.mandiPrices = true; state.error = null; })
      .addCase(getMandiPrices.fulfilled, (state, action) => { state.mandiPrices = action.payload; state.loading.mandiPrices = false; })
      .addCase(getMandiPrices.rejected, (state, action) => { state.loading.mandiPrices = false; state.error = action.payload; });
  },
});

export const { clearError } = mandiSlice.actions;
export default mandiSlice.reducer;


