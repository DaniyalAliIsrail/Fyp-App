import { View, Text, Modal, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";

export default function ReportSummaryModal({ visible, onClose, reportData, reportResponse }) {
  if (!reportData) return null;

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

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color={COLORS.success} />
            </View>
            <Text style={styles.title}>Report Submitted Successfully!</Text>
            <Text style={styles.subtitle}>
              Your crime report has been securely encrypted and submitted to the authorities.
            </Text>
          </View>

          {/* Report Summary */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Report Details</Text>

              {(reportResponse?.report_id || reportResponse?.id || reportResponse?.reportId) && (
                <View style={styles.row}>
                  <Ionicons name="document-text" size={20} color={COLORS.primary} />
                  <View style={styles.rowContent}>
                    <Text style={styles.label}>Report ID</Text>
                    <Text style={styles.value}>
                      #{reportResponse.report_id || reportResponse.id || reportResponse.reportId}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.row}>
                <Ionicons name="alert-circle" size={20} color={COLORS.primary} />
                <View style={styles.rowContent}>
                  <Text style={styles.label}>Crime Type</Text>
                  <Text style={styles.value}>{reportData.crime_type}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons name="calendar" size={20} color={COLORS.primary} />
                <View style={styles.rowContent}>
                  <Text style={styles.label}>Incident Date & Time</Text>
                  <Text style={styles.value}>{formatDate(reportData.incident_datetime)}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
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
                <Ionicons name="speedometer" size={20} color={COLORS.primary} />
                <View style={styles.rowContent}>
                  <Text style={styles.label}>Severity</Text>
                  <View style={styles.severityBadge}>
                    <Text style={[
                      styles.severityText,
                      reportData.severity === 'High' && styles.severityHigh,
                      reportData.severity === 'Medium' && styles.severityMedium,
                      reportData.severity === 'Low' && styles.severityLow,
                    ]}>
                      {reportData.severity}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.row}>
                <Ionicons
                  name={reportData.is_anonymous ? "eye-off" : "person"}
                  size={20}
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
                <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
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

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onClose}
            >
              <Ionicons name="checkmark" size={20} color={COLORS.white} />
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: COLORS.lightGray,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
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
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    marginBottom: 16,
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
  },
  value: {
    fontSize: 15,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  cityText: {
    fontSize: 13,
    color: COLORS.primary,
    marginTop: 2,
  },
  coordsText: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: 2,
  },
  severityBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  severityText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  severityHigh: {
    color: COLORS.danger,
    backgroundColor: "#FFE5E5",
  },
  severityMedium: {
    color: "#FF9800",
    backgroundColor: "#FFF3E0",
  },
  severityLow: {
    color: "#4CAF50",
    backgroundColor: "#E8F5E9",
  },
  descriptionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  securitySection: {
    flexDirection: "row",
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
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
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 4,
  },
  securityText: {
    fontSize: 12,
    color: "#4CAF50",
    lineHeight: 18,
  },
  nextStepsSection: {
    padding: 16,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    marginBottom: 10,
  },
  nextStepsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 12,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.primary,
    color: COLORS.white,
    borderRadius: 14,
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "bold",
    fontSize: 14,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
