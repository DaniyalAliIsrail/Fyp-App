import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, createTransform } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./slices/auth.slice";
import reportReducer from "./slices/report.slice";

// Combine all slices
const rootReducer = combineReducers({
  auth: authReducer,
  report: reportReducer,
});

/*
  Transform to persist ONLY:
  - currentUser
  - token

  And reset:
  - loading
  - error
*/
const authTransform = createTransform(
  // Before saving to storage
  (inboundState) => {
    return {
      currentUser: inboundState.currentUser,
      token: inboundState.token,
    };
  },

  // When rehydrating from storage
  (outboundState) => {
    return {
      ...outboundState,
      loading: false,
      error: null,
    };
  },

  { whitelist: ["auth"] }
);

// Persist config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"],
  transforms: [authTransform],
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

// Persistor
export const persistor = persistStore(store);