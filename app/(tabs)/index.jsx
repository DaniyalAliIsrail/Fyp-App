import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Crime Report App</Text>
        <Text style={styles.subtitle}>
          {currentUser ? "Welcome to Home Screen" : "Report crimes safely and anonymously"}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Ionicons name="home-outline" size={100} color="#2b303a" />
        <Text style={styles.welcomeText}>
          {currentUser
            ? `Welcome, ${currentUser.firstname}!`
            : "Welcome to Crime Report App"}
        </Text>
        <Text style={styles.description}>
          {currentUser
            ? "You can now file reports and track your submissions."
            : "Please login or sign up to file a crime report and help make your community safer."}
        </Text>
      </View>

      {/* Quick Actions - Only show if logged in */}
      {currentUser && (
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Quick Actions</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={24} color="#2b303a" />
            <Text style={styles.menuItemText}>File a Report</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push("/(tabs)/reports")}>
            <Ionicons name="list-outline" size={24} color="#2b303a" />
            <Text style={styles.menuItemText}>My Reports</Text>
            <Ionicons name="chevron-forward-outline" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#2b303a",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
  },
  content: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2b303a",
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  menuContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b303a",
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: "#2b303a",
    marginLeft: 15,
    fontWeight: "500",
  },
});
