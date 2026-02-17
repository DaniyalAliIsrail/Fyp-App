import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const client = axios.create({
  // Replace with your computer's IP address for Expo Go testing
  // Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
  // Current IP: 192.168.6.106 (from ipconfig Ethernet)
  baseURL: "http://192.168.7.106:3004/api/v1/",
  timeout: 90000, // 90 seconds for file uploads to Cloudinary
});

// Add token automatically
client.interceptors.request.use(async (config) => {
  console.log("=== AXIOS REQUEST INTERCEPTOR ===");
  console.log("URL:", config.baseURL + config.url);
  console.log("Method:", config.method);
  console.log("Headers:", config.headers);

  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
client.interceptors.response.use(
  (response) => {
    console.log("=== AXIOS RESPONSE SUCCESS ===");
    console.log("Status:", response.status);
    console.log("Data:", response.data);
    return response;
  },
  (error) => {
    console.log("=== AXIOS RESPONSE ERROR ===");
    console.log("Error Message:", error.message);
    console.log("Error Code:", error.code);
    console.log("Error Response:", error.response?.data);
    console.log("Error Status:", error.response?.status);
    console.log("Request URL:", error.config?.url);
    return Promise.reject(error);
  }
);

export default client;
