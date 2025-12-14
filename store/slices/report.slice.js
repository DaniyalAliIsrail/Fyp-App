import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { report } from "../../Repositories/report";

const initialState = {
  reports: [],
  currentReport: null,
  error: null,
  loading: false,
  success: false,
};

// Async thunk for creating a crime report
export const createReport = createAsyncThunk(
  "report/create",
  async (reportData, { rejectWithValue }) => {
    try {
      console.log("=== REPORT SLICE: Creating Report ===");
      const response = await report.createReport(reportData);
      console.log("=== REPORT SLICE: Report Created ===", response.data);

      return response.data;
    } catch (error) {
      console.log("=== REPORT SLICE: Create Report Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);
      console.log("Error status:", error.response?.status);

      const errorMessage = error.response?.data?.message ||
                          error.response?.data?.errors?.[0]?.message ||
                          error.message ||
                          "Failed to create report";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for fetching user's reports
export const fetchUserReports = createAsyncThunk(
  "report/fetchUserReports",
  async (_, { rejectWithValue }) => {
    try {
      console.log("=== REPORT SLICE: Fetching User Reports ===");
      const response = await report.getUserReports();
      console.log("=== REPORT SLICE: Reports Fetched ===", response.data);

      return response.data;
    } catch (error) {
      console.log("=== REPORT SLICE: Fetch Reports Error ===");
      console.log("Error message:", error.message);
      console.log("Error response:", error.response?.data);

      const errorMessage = error.response?.data?.message ||
                          error.message ||
                          "Failed to fetch reports";
      return rejectWithValue(errorMessage);
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
    clearReportSuccess: (state) => {
      state.success = false;
    },
    resetReportState: (state) => {
      state.error = null;
      state.loading = false;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Report reducers
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Extract the nested 'report' object from backend response
        // Backend returns: { success: true, message: "...", report: {...} }
        state.currentReport = action.payload.report || action.payload;
        // Add new report to the list
        if (state.reports) {
          state.reports.unshift(action.payload.report || action.payload);
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch User Reports reducers
      .addCase(fetchUserReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
        state.error = null;
      })
      .addCase(fetchUserReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError, clearReportSuccess, resetReportState } = reportSlice.actions;
export default reportSlice.reducer;
