import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const client = axios.create({
  // Replace with your computer's IP address for Expo Go testing
  // Find it with: ipconfig (Windows) or ifconfig (Mac/Linux)
  baseURL: "http://192.168.6.106:3004/api/v1/",
  timeout: 90000, // 80 seconds for file uploads to Cloudinary
});

// Add token automatically
client.interceptors.request.use(async(config) => {
   const token =await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
