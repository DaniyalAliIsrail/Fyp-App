import client from "../utils/client";

export const report = {
  // Create a new crime report
  createReport: (formData) =>
    client.post("report/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Get all reports for the logged-in user
  getUserReports: () => client.get("report/user"),

  // Get a specific report by ID
  getReportById: (reportId) => client.get(`report/${reportId}`),

  // Update a report
  updateReport: (reportId, data) =>
    client.put(`report/${reportId}`, data),

  // Delete a report
  deleteReport: (reportId) => client.delete(`report/${reportId}`),
};
