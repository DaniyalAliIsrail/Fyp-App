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

const userSlice = createSlice({
  name: "user",
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
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.data || action.payload.user;
        state.error = null;
      })
      .addCase(signUpUser.rejected, (state, action) => {
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

// // Async login function
// export const loginUser = createAsyncThunk(
//   "auth/loginUser",
//   async (payload, { rejectWithValue }) => {
//     try {
//       const res = await authRepository.login(payload);
//       return res.data; // { user, token }
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Login failed");
//     }
//   }
// );

// const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//     token: null,
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload.user;
//         state.token = action.payload.token;
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export const { logout } = authSlice.actions;
// export default authSlice.reducer;
