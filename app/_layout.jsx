// import { Stack } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import SafeScreen from "../components/SafeScreen";

// export default function RootLayout() {
//   return (
//     <SafeAreaProvider>
//       <SafeScreen>
//         <Stack screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="index" />
//           <Stack.Screen name="(auth)" />
//         </Stack>
//       </SafeScreen>
//     </SafeAreaProvider>
//   );
// }



import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "../components/SafeScreen";

// Redux imports
import { Provider } from "react-redux";
import { store, persistor } from "../store";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeScreen>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
            </Stack>
          </SafeScreen>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}