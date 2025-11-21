import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../Repositories/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

// Async thunk for user signup
export const signUpUser = createAsyncThunk(
  "user/signUp",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("=== AUTH SLICE: Calling API ===");
      const response = await auth.signUp(formData);
      console.log("=== AUTH SLICE: API Response ===", response.data);

      // Store token if returned by backend
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      // Log full error for debugging
      console.log("=== AUTH SLICE: API Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);

      // Extract error message from backend response
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message ||
                          "Signup failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("=== AUTH SLICE: Login API Call ===");
      const response = await auth.login(credentials);
      console.log("=== AUTH SLICE: Login Response ===", response.data);

      // Store token if returned by backend
      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.log("=== AUTH SLICE: Login Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);

      // Extract error message from backend response
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message ||
                          "Login failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for OTP verification
export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async (otpData, { rejectWithValue }) => {
    try {
      console.log("=== AUTH SLICE: OTP Verification API Call ===");
      const response = await auth.verifyOTP(otpData);
      console.log("=== AUTH SLICE: OTP Verification Response ===", response.data);

      return response.data;
    } catch (error) {
      console.log("=== AUTH SLICE: OTP Verification Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);

      // Extract error message from backend response
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message ||
                          "OTP verification failed";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for Resend OTP
export const resendOTP = createAsyncThunk(
  "user/resendOTP",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("=== AUTH SLICE: Resend OTP API Call ===");
      const response = await auth.resendOTP(userData);
      console.log("=== AUTH SLICE: Resend OTP Response ===", response.data);

      return response.data;
    } catch (error) {
      console.log("=== AUTH SLICE: Resend OTP Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);

      // Extract error message from backend response
      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message ||
                          "Failed to resend OTP";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.removeItem("token");
      return null;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSucess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  
    signOutSuccess:(state)=>{
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Signup reducers
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state) => {
        state.loading = false;
        // Don't set currentUser on signup - user needs to verify OTP first
        state.currentUser = null;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login reducers
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // Extract user data from response - try multiple possible paths
        state.currentUser = action.payload.data?.loginUser ||
                           action.payload.loginUser ||
                           action.payload.data?.user ||
                           action.payload.user ||
                           action.payload.data ||
                           action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // OTP Verification reducers
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Don't set currentUser on OTP verification, just verify the account
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Resend OTP reducers
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout reducers
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  signInStart,
  signInSucess,
  signInFailure,
  signOutSuccess
} = userSlice.actions;
export default userSlice.reducer;
