import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,// Sabhi screens ke liye 
        // header ko hide kar diya gaya
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Login",
        }}
      />
      <Stack.Screen
      name="signup"
      options={{
        title: "Signup",
      }}
      
      />
    </Stack>
  );
}
