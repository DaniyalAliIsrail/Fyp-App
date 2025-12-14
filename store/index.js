import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { persistStore, persistReducer } from "redux-persist";
// import AsyncStorage from "@react-native-async-storage/async-storage";


import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // RN me storage
import authReducer from "./slices/auth.slice";
import reportReducer from "./slices/report.slice";

// Combine all slices
const rootReducer = combineReducers({
  auth: authReducer,
  report: reportReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"], // Only auth slice will be persisted
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
