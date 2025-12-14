import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSelector } from "react-redux";
import COLORS from "../../constants/colors";

export default function TabsLayout() {
  const { currentUser } = useSelector((state) => state.auth);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary || "#2b303a",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: 45,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Login",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in-outline" size={size} color={color} />
          ),
          href: currentUser ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          title: "Sign Up",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ),
          href: currentUser ? null : undefined,
        }}
      />

      <Tabs.Screen
        name="verify-otp"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          href: currentUser ? undefined : null,
        }}
      />

      <Tabs.Screen
        name="report-crime"
        options={{
          title: "Report Crime",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
          href: currentUser ? undefined : null,
        }}
      />
    </Tabs>
  );
}
