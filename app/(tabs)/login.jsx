import { Image } from "expo-image";
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
import { useState, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/auth.slice";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, currentUser } = useSelector((state) => state.auth);

  const [cnic_no, setCnicNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Navigate to home if user is logged in
  useEffect(() => {
    if (currentUser) {
      router.replace("/(tabs)");
    }
  }, [currentUser]);

  // Handle CNIC input with auto-formatting
  const handleCnicChange = (value) => {
    let digits = value.replace(/\D/g, "").slice(0, 13);

    if (digits.length > 5 && digits.length <= 12) {
      value = digits.slice(0, 5) + "-" + digits.slice(5, 12);
    } else if (digits.length === 13) {
      value =
        digits.slice(0, 5) +
        "-" +
        digits.slice(5, 12) +
        "-" +
        digits.slice(12);
    } else {
      value = digits;
    }

    setCnicNo(value);
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!cnic_no || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(loginUser({ cnic_no, password })).unwrap();
      console.log("=== LOGIN SUCCESS ===");
      console.log("Response:", JSON.stringify(result, null, 2));

      Alert.alert("Success", "Login successful!", [
        { text: "OK", onPress: () => router.replace("/(tabs)") }
      ]);
    } catch (error) {
      console.log("=== LOGIN ERROR ===");
      console.log("Error:", error);
      Alert.alert("Error", error || "Login failed");
    }
  };
  return (
    <KeyboardAvoidingView
     style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.topIllustration}>
          <Image
            source={require("../../assets/images/Login-rafiki (1).png")}
            style={styles.illustrationImage}
            contentFit="contain"
          />
        </View>

        <View style={styles.card}>
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CNIC No</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your CNIC Number"
                  placeholderTextColor={COLORS.placeholderText}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  value={cnic_no}
                  onChangeText={handleCnicChange}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.primary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter Your Password"
                  placeholderTextColor={COLORS.placeholderText}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={() => router.push("/forgot-password")}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Link href="/(tabs)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.link}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
