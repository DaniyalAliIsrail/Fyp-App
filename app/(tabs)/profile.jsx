import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { logoutUser } from "../../store/slices/auth.slice";
import COLORS from "../../constants/colors";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await dispatch(logoutUser());
            router.replace("/(tabs)");
          },
        },
      ]
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view your profile</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          {currentUser?.profile_image ? (
            <Image
              source={{ uri: currentUser.profile_image }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Ionicons name="person" size={60} color="#999" />
            </View>
          )}
        </View>

        <Text style={styles.userName}>
          {currentUser.firstname} {currentUser.lastname}
        </Text>
        <Text style={styles.userEmail}>{currentUser.email}</Text>
      </View>

      {/* User Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailItem}>
          <Ionicons name="card-outline" size={24} color={COLORS.primary} />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>CNIC</Text>
            <Text style={styles.detailValue}>{currentUser.cnic_no}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="call-outline" size={24} color={COLORS.primary} />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Phone</Text>
            <Text style={styles.detailValue}>{currentUser.phone_no}</Text>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
          <View style={styles.detailTextContainer}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{currentUser.email}</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: COLORS.primary || "#2b303a",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginBottom: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary || "#2b303a",
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.primary || "#2b303a",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2b303a",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
  detailsSection: {
    backgroundColor: "white",
    paddingVertical: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailTextContainer: {
    marginLeft: 15,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: "#2b303a",
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#dc3545",
    marginHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
  errorText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },
});
