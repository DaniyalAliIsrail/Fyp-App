// Polyfills must be imported first
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

// Redux imports
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { useEffect, useRef } from "react";
import { Alert, Platform } from "react-native";

import { pushApi } from "../Repositories/push";
import { locationApi } from "../Repositories/location";


// 🔥 Helper: Register push token
async function registerForPushToken() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}


// 🔥 Helper: Send location to backend
async function sendLocationToBackend() {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert("Permission Required", "Location permission is required.");
    return;
  }

  const loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  await locationApi.shareLocation({
    latitude: loc.coords.latitude,
    longitude: loc.coords.longitude,
  });
}


// 🔥 This component runs INSIDE Redux Provider
function AppContent() {
  const { currentUser } = useSelector((state) => state.auth);
  const responseListener = useRef(null);

  useEffect(() => {
    if (!currentUser) return;

    // 1️⃣ Register push token and save in backend
    const initPush = async () => {
      const expoToken = await registerForPushToken();

      if (expoToken) {
        try {
          await pushApi.saveExpoPushToken(expoToken);
        } catch (e) {
          console.log("Push token save failed:", e?.response?.data || e.message);
        }
      }
    };

    initPush();

    // 2️⃣ If app was opened from notification while killed
    (async () => {
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      const type = lastResponse?.notification?.request?.content?.data?.type;

      if (type === "CRIME_ALERT") {
        try {
          await sendLocationToBackend();
        } catch (e) {
          console.log("Cold start location send failed:", e.message);
        }
      }
    })();

    // 3️⃣ If user taps notification while app running/background
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        const type = response?.notification?.request?.content?.data?.type;

        if (type === "CRIME_ALERT") {
          try {
            await sendLocationToBackend();
          } catch (e) {
            console.log("Notification tap location send failed:", e.message);
          }
        }
      });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };

  }, [currentUser]);

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  );
}


// 🔥 Root Layout
export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}