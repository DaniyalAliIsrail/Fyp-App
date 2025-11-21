import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import styles from "../../styles/login.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { verifyOTP, resendOTP } from "../../store/slices/auth.slice";

export default function VerifyOTP() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Get id from signup page (passed via navigation) - user won't see this field
  const id = params.user_id || "";
  const [otp, setOtp] = useState("");
  const [resendingOTP, setResendingOTP] = useState(false);

  const { loading } = useSelector((state) => state.auth);

  const handleVerifyOTP = async () => {
    // Validate OTP
    if (!otp) {
      Alert.alert("Error", "Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      Alert.alert("Error", "OTP must be 6 digits");
      return;
    }

    // Check if user_id was passed from signup
    if (!id) {
      Alert.alert("Error", "Invalid session. Please register again.");
      return;
    }

    try {
      const result = await dispatch(verifyOTP({ id, otp })).unwrap();
      console.log("=== OTP VERIFICATION SUCCESS ===");
      console.log("Response:", JSON.stringify(result, null, 2));

      Alert.alert("Success", "Email verified successfully! Please login.", [
        { text: "OK", onPress: () => router.replace("/(tabs)/login") }
      ]);
    } catch (error) {
      console.log("=== OTP VERIFICATION ERROR ===");
      console.log("Error:", error);
      Alert.alert("Error", error || "OTP verification failed");
    }
  };

  const handleResendOTP = async () => {
    if (!id) {
      Alert.alert("Error", "User ID is required");
      return;
    }

    try {
      setResendingOTP(true);
      const result = await dispatch(resendOTP({ id })).unwrap();
      console.log("=== RESEND OTP SUCCESS ===");
      console.log("Response:", JSON.stringify(result, null, 2));

      Alert.alert("Success", "A new OTP has been sent to your email!");
    } catch (error) {
      console.log("=== RESEND OTP ERROR ===");
      console.log("Error:", error);
      Alert.alert("Error", error || "Failed to resend OTP");
    } finally {
      setResendingOTP(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Ionicons name="mail-outline" size={60} color={COLORS.primary} />
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit OTP to your email. Please enter it below to verify your account.
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* OTP */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>OTP Code</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="key-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter 6-digit OTP"
                  placeholderTextColor={COLORS.placeholderText}
                  keyboardType="numeric"
                  maxLength={6}
                  value={otp}
                  onChangeText={setOtp}
                  editable={!loading && !resendingOTP}
                />
              </View>
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={handleVerifyOTP}
              disabled={loading || resendingOTP}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP Button */}
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4a90e2", marginTop: 10 }]}
              onPress={handleResendOTP}
              disabled={loading || resendingOTP}
            >
              {resendingOTP ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Resend OTP</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already verified?</Text>
              <TouchableOpacity onPress={() => router.replace("/(tabs)/login")}>
                <Text style={styles.link}>Go to Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
