import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { clearReportSuccess, resetReportState } from "../store/slices/report.slice";
import COLORS from "../constants/colors";

export default function ReportSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useLocalSearchParams();

  // Parse report data from params
  const reportData = params.reportData ? JSON.parse(params.reportData) : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDone = () => {
    dispatch(clearReportSuccess());
    dispatch(resetReportState());
    router.replace("/(tabs)/");
  };

  if (!reportData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No report data available</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleDone}>
          <Text style={styles.primaryButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Success Header */}
        <View style={styles.header}>
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
          </View>
          <Text style={styles.title}>Report Submitted Successfully!</Text>
          <Text style={styles.subtitle}>
            Your crime report has been securely encrypted and submitted to the authorities.
          </Text>
        </View>

        {/* Report Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Details</Text>

          {reportData.id && (
            <View style={styles.row}>
              <Ionicons name="document-text" size={22} color={COLORS.primary} />
              <View style={styles.rowContent}>
                <Text style={styles.label}>Report ID</Text>
                <Text style={styles.value}>#{reportData.id}</Text>
              </View>
            </View>
          )}

          <View style={styles.row}>
            <Ionicons name="alert-circle" size={22} color={COLORS.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Crime Type</Text>
              <Text style={styles.value}>{reportData.crime_type}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons name="calendar" size={22} color={COLORS.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Incident Date & Time</Text>
              <Text style={styles.value}>{formatDate(reportData.incident_datetime)}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons name="location" size={22} color={COLORS.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Location</Text>
              <Text style={styles.value}>{reportData.location_text}</Text>
              {reportData.city && (
                <Text style={styles.cityText}>📍 {reportData.city}</Text>
              )}
              {reportData.latitude && reportData.longitude && (
                <Text style={styles.coordsText}>
                  {reportData.latitude}, {reportData.longitude}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons name="speedometer" size={22} color={COLORS.primary} />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Severity</Text>
              <View style={[
                styles.severityBadge,
                reportData.severity === 'High' && styles.severityBadgeHigh,
                reportData.severity === 'Medium' && styles.severityBadgeMedium,
                reportData.severity === 'Low' && styles.severityBadgeLow,
              ]}>
                <Text style={[
                  styles.severityText,
                  reportData.severity === 'High' && styles.severityTextHigh,
                  reportData.severity === 'Medium' && styles.severityTextMedium,
                  reportData.severity === 'Low' && styles.severityTextLow,
                ]}>
                  {reportData.severity}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Ionicons
              name={reportData.is_anonymous ? "eye-off" : "person"}
              size={22}
              color={COLORS.primary}
            />
            <View style={styles.rowContent}>
              <Text style={styles.label}>Submission Type</Text>
              <Text style={styles.value}>
                {reportData.is_anonymous ? "Anonymous" : "Identified"}
              </Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.description}>{reportData.description}</Text>
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securitySection}>
          <View style={styles.securityIcon}>
            <Ionicons name="shield-checkmark" size={28} color={COLORS.success} />
          </View>
          <View style={styles.securityContent}>
            <Text style={styles.securityTitle}>End-to-End Encrypted</Text>
            <Text style={styles.securityText}>
              Your report has been encrypted using military-grade AES-256 encryption before transmission.
            </Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.nextStepsTitle}>What Happens Next?</Text>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>Authorities will review your report</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>Investigation will be initiated if necessary</Text>
          </View>
          <View style={styles.stepItem}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>You can track the status in "My Reports"</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleDone}
        >
          <Ionicons name="checkmark" size={20} color={COLORS.white} />
          <Text style={styles.primaryButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    marginBottom: 20,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 18,
    gap: 12,
  },
  rowContent: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 4,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  cityText: {
    fontSize: 14,
    color: COLORS.primary,
    marginTop: 4,
    fontWeight: "500",
  },
  coordsText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  severityBadgeHigh: {
    backgroundColor: "#FFE5E5",
  },
  severityBadgeMedium: {
    backgroundColor: "#FFF3E0",
  },
  severityBadgeLow: {
    backgroundColor: "#E8F5E9",
  },
  severityText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  severityTextHigh: {
    color: COLORS.danger,
  },
  severityTextMedium: {
    color: "#FF9800",
  },
  severityTextLow: {
    color: "#4CAF50",
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 14,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  description: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 22,
  },
  securitySection: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 18,
    borderRadius: 10,
    marginBottom: 20,
    gap: 12,
  },
  securityIcon: {
    marginTop: 2,
  },
  securityContent: {
    flex: 1,
  },
  securityTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 6,
  },
  securityText: {
    fontSize: 13,
    color: "#4CAF50",
    lineHeight: 20,
  },
  nextStepsSection: {
    padding: 18,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    marginBottom: 10,
  },
  nextStepsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: 16,
    textAlign: "center",
    lineHeight: 32,
    fontWeight: "bold",
    fontSize: 15,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: COLORS.danger,
    textAlign: "center",
    marginTop: 40,
  },
});
