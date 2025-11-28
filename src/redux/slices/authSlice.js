import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const registerLoginUser = createAsyncThunk(
  "auth/registerLoginUser",
  async ({ phone, email, firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://server.cropgenapp.com/v1/api/auth/cropydeal-register-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
            email,
            firstName,
            lastName,
            organizationCode: "TEST",
            terms: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const data = await response.json();

      if (data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    accessToken: localStorage.getItem("accessToken") || null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerLoginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerLoginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.accessToken = action.payload.accessToken || null;
      })
      .addCase(registerLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
