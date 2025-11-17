import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:3004/api/v1/", 
  timeout: 10000,
});

// Add token automatically
client.interceptors.request.use( (config) => {
   const token =  AsyncStorage.getItem("token");
  if (token) {c
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
