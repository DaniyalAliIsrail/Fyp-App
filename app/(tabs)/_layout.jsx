import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Image, StyleSheet, View } from "react-native";
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
          marginBottom:45,
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
          title: "Home45454",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Hidden screens (not in tab bar) */}
      <Tabs.Screen
        name="verify-otp"
        options={{
          href: null, // Hide from tab bar
        }}
      />

      {currentUser ? (
        // Tabs for logged-in users
        <>
          <Tabs.Screen
            name="reports"
            options={{
              title: "My Reports",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="list-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="profile1111"
            options={{
              title: currentUser.email || "Profile1111",
              tabBarIcon: ({ color, focused }) => (
                <View style={tabStyles.profileTabIcon}>
                  {currentUser?.profile_image ? (
                    <Image
                      source={{ uri: currentUser.profile_image }}
                      style={[
                        tabStyles.profileImage,
                        focused && tabStyles.profileImageActive,
                      ]}
                    />
                  ) : (
                    <Ionicons name="person-outline" size={24} color={color} />
                  )}
                </View>
              ),
            }}
          />
          {/* Hide login and signup for logged-in users */}
          <Tabs.Screen
            name="login121212"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="signup121212"
            options={{
              href: null,
            }}
          />
        </>
      ) : (
        // Tabs for guest users (not logged in)
        <>
          {/* Hide reports and profile for guests */}
          <Tabs.Screen
            name="reports"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              href: null,
            }}
          />
          <Tabs.Screen
            name="login1212121212"
            options={{
              title: "Login12121212",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="log-in-outline" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="signup12121212"
            options={{
              title: "Sign Up4212212",
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person-add-outline" size={size} color={color} />
              ),
            }}
          />
        </>
      )}
    </Tabs>
  );
}

const tabStyles = StyleSheet.create({
  profileTabIcon: {
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#999",
  },
  profileImageActive: {
    borderColor: COLORS.primary || "#2b303a",
  },
});
