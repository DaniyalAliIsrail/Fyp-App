import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../Repositories/auth";
import COLORS from "../constants/colors";

export default function VerifyForgotPasswordOTP() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId, email } = params;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Validation Error", "Please enter the OTP.");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Validation Error", "OTP must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      console.log("=== Verifying Forgot Password OTP ===");
      console.log("User ID:", userId);
      console.log("OTP:", otp);

      const response = await auth.verifyForgetPasswordOTP({
        id: userId,
        otp: otp,
      });

      console.log("=== Verify OTP Response ===");
      console.log("Response:", response.data);

      if (response.data.success) {
        const resetToken = response.data.reset_token;
        Alert.alert("Success", "OTP verified successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/reset-password-with-token",
                params: { resetToken, email },
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.error("=== Verify OTP Error ===");
      console.error("Error:", error);
      console.error("Error Response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid OTP. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      console.log("=== Resending OTP ===");
      const response = await auth.forgetPassword({ email });

      if (response.data.success) {
        Alert.alert("Success", "A new OTP has been sent to your email.");
      }
    } catch (error) {
      console.error("=== Resend OTP Error ===");
      console.error("Error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verify OTP</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={80} color={COLORS.primary} />
          </View>

          <Text style={styles.title}>Check Your Email</Text>
          <Text style={styles.description}>
            We've sent a 6-digit OTP to{"\n"}
            <Text style={styles.email}>{email}</Text>
          </Text>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.otpInput}
                placeholder="000000"
                value={otp}
                onChangeText={(value) => {
                  // Only allow digits and limit to 6 characters
                  const numericValue = value.replace(/[^0-9]/g, "");
                  if (numericValue.length <= 6) {
                    setOtp(numericValue);
                  }
                }}
                keyboardType="number-pad"
                maxLength={6}
                textAlign="center"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Verify OTP</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive the code?</Text>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={loading}
              >
                <Text style={styles.resendLink}>Resend OTP</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: COLORS.primary || "#2b303a",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2b303a",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  email: {
    fontWeight: "bold",
    color: COLORS.primary || "#2b303a",
  },
  formSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b303a",
    marginBottom: 8,
    textAlign: "center",
  },
  otpInput: {
    borderWidth: 2,
    borderColor: COLORS.primary || "#2b303a",
    borderRadius: 8,
    paddingVertical: 15,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 10,
    backgroundColor: "#f9f9f9",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary || "#2b303a",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonDisabled: {
    backgroundColor: "#999",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    color: "#666",
    fontSize: 14,
    marginRight: 5,
  },
  resendLink: {
    color: COLORS.primary || "#2b303a",
    fontSize: 14,
    fontWeight: "600",
  },
});
