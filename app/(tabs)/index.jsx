import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

export default function Home() {
  const { currentUser } = useSelector((state) => state.auth);
  const router = useRouter();

  const features = [
    {
      icon: "shield-checkmark",
      title: "Secure & Anonymous",
      description: "Your identity is protected with end-to-end encryption",
      color: "#4CAF50",
    },
    {
      icon: "time",
      title: "Real-Time Updates",
      description: "Track your report status and get instant notifications",
      color: "#FF9800",
    },
    {
      icon: "people",
      title: "Community Safety",
      description: "Help make your neighborhood safer for everyone",
      color: COLORS.primary,
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <Ionicons name="shield-checkmark" size={80} color={COLORS.white} />
          <Text style={styles.heroTitle}>
            {currentUser ? `Welcome back, ${currentUser.firstname}!` : "SCRP"}
          </Text>
          <Text style={styles.heroSubtitle}>
            {currentUser
              ? "Your reports make a difference in keeping our community safe"
              : "Smart Crime Reporting & Prediction System"}
          </Text>
        </View>
      </View>

      {/* Quick Actions - Show for logged in users */}
      {currentUser && (
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => router.push("/(tabs)/report-crime")}
          >
            <Ionicons name="document-text" size={24} color={COLORS.white} />
            <Text style={styles.primaryActionText}>File a Report</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Use SCRP?</Text>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <View style={[styles.featureIconContainer, { backgroundColor: feature.color + "15" }]}>
              <Ionicons name={feature.icon} size={32} color={feature.color} />
            </View>
            <View style={styles.featureTextContainer}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Section */}
      <View style={styles.emergencySection}>
        <View style={styles.emergencyHeader}>
          <Ionicons name="warning" size={24} color="#E53935" />
          <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        </View>
        <View style={styles.emergencyContacts}>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call" size={20} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>Police: 15</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.emergencyButton}>
            <Ionicons name="call" size={20} color={COLORS.white} />
            <Text style={styles.emergencyButtonText}>Ambulance: 1122</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Confidential</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>Fast</Text>
          <Text style={styles.statLabel}>Response</Text>
        </View>
      </View>

      {/* CTA for non-logged in users */}
      {!currentUser && (
        <View style={styles.ctaSection}>
          <Ionicons name="lock-closed" size={48} color={COLORS.primary} style={styles.ctaIcon} />
          <Text style={styles.ctaTitle}>Secure Your Community</Text>
          <Text style={styles.ctaDescription}>
            Login to report crimes securely and help keep our community safe. All reports are encrypted and protected.
          </Text>
          <TouchableOpacity
            style={styles.ctaButtonFullWidth}
            onPress={() => router.push("/(tabs)/login")}
          >
            <Ionicons name="log-in-outline" size={20} color={COLORS.white} />
            <Text style={styles.ctaButtonFullWidthText}>Login to Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSection: {
    backgroundColor: COLORS.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  primaryActionButton: {
    backgroundColor: "#E53935",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 12,
    marginTop:42,
  },
  primaryActionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.white,
  },
  secondaryActionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emergencySection: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: "#FFF3E0",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#E53935",
  },
  emergencyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginLeft: 8,
  },
  emergencyContacts: {
    flexDirection: "row",
    gap: 12,
  },
  emergencyButton: {
    flex: 1,
    backgroundColor: "#E53935",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  emergencyButtonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.white,
  },
  statsSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  ctaSection: {
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaIcon: {
    marginBottom: 16,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  ctaDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  ctaButtonFullWidth: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  ctaButtonFullWidthText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.white,
  },
  bottomSpacer: {
    height: 120,
  },
});
