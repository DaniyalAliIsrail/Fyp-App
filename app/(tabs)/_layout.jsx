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
      {/* Home - Always visible */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Login and Signup - Hidden from tabs, accessible via router.push() */}
      <Tabs.Screen
        name="login"
        options={{
          href: null, // Remove from tab bar completely
        }}
      />

      <Tabs.Screen
        name="signup"
        options={{
          href: null, // Remove from tab bar completely
        }}
      />

      <Tabs.Screen
        name="verify-otp"
        options={{
          href: null, // Hidden screen
        }}
      />

      {/* Report Crime - Only visible when logged in */}
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

      {/* Profile - Only visible when logged in */}
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
    </Tabs>
  );
}
