import { Image } from "expo-image";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import styles from "../../styles/Signup.styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import { useState } from "react";
import { Link, useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDispatch, useSelector } from "react-redux";
import { signUpUser } from "../../store/slices/auth.slice";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    cnic_no: "",
    date_of_birth: "",
    gender: "",
    phone: "",
    profile_image: null,
    cnic_front: null,
    cnic_back: null,
  });
  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [dobDate, setDobDate] = useState(formData.dob ? new Date(formData.dob) : new Date());
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (key, value) => {
    let newValue = value;

    // Format CNIC number with dashes (12345-1234567-1)
    if (key === "cnic_no") {
      let digits = newValue.replace(/\D/g, "").slice(0, 13);

      if (digits.length > 5 && digits.length <= 12) {
        newValue = digits.slice(0, 5) + "-" + digits.slice(5, 12);
      } else if (digits.length === 13) {
        newValue =
          digits.slice(0, 5) +
          "-" +
          digits.slice(5, 12) +
          "-" +
          digits.slice(12);
      } else {
        newValue = digits;
      }
    }

    // Limit phone number to 11 digits
    if (key === "phone") {
      let digits = newValue.replace(/\D/g, ""); // Remove non-digits
      newValue = digits.slice(0, 11); // Limit to 11 digits
    }

    setFormData((prev) => ({ ...prev, [key]: newValue }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access media library is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      handleChange("profile_image", result.assets[0].uri);
    }
  };
  
  const handleSignup = async () => {
    try {
      // Validate required fields
      if (!formData.firstname || !formData.lastname || !formData.email ||
          !formData.password || !formData.cnic_no || !formData.date_of_birth ||
          !formData.gender || !formData.phone) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Validate required images
      if (!formData.profile_image) {
        Alert.alert("Error", "Profile image is required");
        return;
      }

      if (!formData.cnic_front) {
        Alert.alert("Error", "CNIC front image is required");
        return;
      }

      if (!formData.cnic_back) {
        Alert.alert("Error", "CNIC back image is required");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert("Error", "Please enter a valid email address");
        return;
      }

      // Validate CNIC format (should be 13 digits with dashes: 12345-1234567-1)
      const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicRegex.test(formData.cnic_no)) {
        Alert.alert("Error", "CNIC must be in format: 12345-1234567-1");
        return;
      }

      // Validate phone number (basic validation - must be digits and reasonable length)
      const phoneDigits = formData.phone.replace(/\D/g, "");
      if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        Alert.alert("Error", "Please enter a valid phone number");
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters long");
        return;
      }

      // Log form state before creating FormData
      console.log("=== SIGNUP PAYLOAD ===");
      console.log("Form Data State:", JSON.stringify(formData, null, 2));

      const data = new FormData();

      // TEXT FIELDS
      data.append("firstname", formData.firstname);
      data.append("lastname", formData.lastname);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("cnic_no", formData.cnic_no);
      data.append("date_of_birth", formData.date_of_birth);
      data.append("gender", formData.gender);
      data.append("phone", formData.phone);

      // Log text fields being sent
      console.log("Text Fields:", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: "****", // Hidden for security
        cnic_no: formData.cnic_no,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        phone: formData.phone,
      });

      // FILE FIELDS
      console.log("File Fields:");
      if (formData.profile_image) {
        console.log("  - profile_image:", formData.profile_image);
        data.append("profile_image", {
          uri: formData.profile_image,
          name: "profile.jpg",
          type: "image/jpeg",
        });
      } else {
        console.log("  - profile_image: Not provided");
      }
      if (formData.cnic_front) {
        console.log("  - cnic_front:", formData.cnic_front);
        data.append("cnic_front", {
          uri: formData.cnic_front,
          name: "cnic_front.jpg",
          type: "image/jpeg",
        });
      } else {
        console.log("  - cnic_front: Not provided");
      }
      if (formData.cnic_back) {
        console.log("  - cnic_back:", formData.cnic_back);
        data.append("cnic_back", {
          uri: formData.cnic_back,
          name: "cnic_back.jpg",
          type: "image/jpeg",
        });
      } else {
        console.log("  - cnic_back: Not provided");
      }

      console.log("=== SENDING TO API ===222222");

      // Dispatch signup action to Redux
      const result = await dispatch(signUpUser(data)).unwrap();
      console.log("=== SIGNUP SUCCESS ===");
      console.log("Response:", JSON.stringify(result, null, 2));

      // Extract user_id from response
      const user_id = result.data?.user?.id || result.user?.id || result.data?.id;

      // Show success and navigate to OTP verification
      Alert.alert(
        "Success",
        "Registration successful! Please check your email for OTP verification code.",
        [
          {
            text: "OK",
            onPress: () => router.replace({
              pathname: "/(tabs)/verify-otp",
              params: { user_id: user_id }
            })
          }
        ]
      );

    } catch (error) {
      console.log("=== SIGNUP ERROR ===");
      console.log("Error:", error);
      Alert.alert("Error", error || "Signup failed");
    }
  };


  return (
    <SafeScreen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            <View style={styles.card}>
              {/* HEADER */}
              <View style={styles.header}>
                <Text style={styles.title}>Create Your Account</Text>
                <Text style={styles.subtitle}>Join SCRP to report and track crime safely</Text>
              </View>

              <View style={styles.formContainer}>
                {/* Profile Image */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    Profile Image <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={pickImage}
                  >
                    {formData.profile_image ? (
                      <Image
                        source={{ uri: formData.profile_image }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="camera-outline"
                        size={40}
                        color={COLORS.placeholderText}
                        style={styles.cameraIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.imagePickerText}>
                    {formData.profile_image
                      ? "Tap to change image"
                      : "Tap to upload image (Required)"}
                  </Text>
                </View>

                {/* First Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your First Name"
                      placeholderTextColor={COLORS.placeholderText}
                      value={formData.firstname}
                      onChangeText={(value) => handleChange("firstname", value)}
                    />
                  </View>
                </View>

                {/* Last Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your Last Name"
                      placeholderTextColor={COLORS.placeholderText}
                      value={formData.lastname}
                      onChangeText={(value) => handleChange("lastname", value)}
                    />
                  </View>
                </View>

                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your Email"
                      placeholderTextColor={COLORS.placeholderText}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(value) => handleChange("email", value)}
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
                      style={[styles.input, { flex: 1 }]}
                      placeholder="Enter Your Password"
                      placeholderTextColor={COLORS.placeholderText}
                      secureTextEntry={!showPassword}
                      value={formData.password}
                      onChangeText={(value) => handleChange("password", value)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ padding: 5 }}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color={COLORS.primary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* CNIC No */}
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
                      value={formData.cnic_no}
                      onChangeText={(value) => handleChange("cnic_no", value)}
                    />
                  </View>
                </View>

                {/* DOB */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Date of Birth</Text>

                  <TouchableOpacity onPress={() => setShowDOBPicker(true)}>
                    <View style={styles.inputContainer}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={COLORS.primary}
                        style={styles.inputIcon}
                      />
                      <View style={styles.input}>
                        <Text
                          style={{
                            color: formData.date_of_birth
                              ? COLORS.textDark
                              : COLORS.placeholderText,
                          }}
                        >
                          {formData.date_of_birth
                            ? formData.date_of_birth
                            : "Enter Your Date of Birth"}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>

                  {showDOBPicker && (
                    <DateTimePicker
                      value={dobDate}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(event, selectedDate) => {
                        setShowDOBPicker(Platform.OS === "ios");
                        if (selectedDate) {
                          setDobDate(selectedDate);
                          handleChange(
                            "date_of_birth",
                            selectedDate.toISOString().split("T")[0]
                          ); // YYYY-MM-DD
                        }
                      }}
                    />
                  )}
                </View>

                {/* Gender */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Gender</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="male-female-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <View style={{ flex: 1, marginLeft: -10 }}>
                      <Picker
                        selectedValue={formData.gender}
                        onValueChange={(value) => handleChange("gender", value)}
                        style={styles.picker}
                      >
                        <Picker.Item label="Select Gender" value="" />
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                        <Picker.Item label="Other" value="other" />
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* Mobile Number */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color={COLORS.primary}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Your Mobile Number"
                      placeholderTextColor={COLORS.placeholderText}
                      keyboardType="phone-pad"
                      value={formData.phone}
                      onChangeText={(value) => handleChange("phone", value)}
                    />
                  </View>
                </View>

                {/* CNIC Front */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    CNIC Front <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={async () => {
                      const { status } =
                        await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== "granted") {
                        alert(
                          "Permission to access media library is required!"
                        );
                        return;
                      }
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                      });
                      if (!result.canceled) {
                        handleChange("cnic_front", result.assets[0].uri);
                      }
                    }}
                  >
                    {formData.cnic_front ? (
                      <Image
                        source={{ uri: formData.cnic_front }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color={COLORS.placeholderText}
                        style={styles.cameraIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.imagePickerText}>
                    {formData.cnic_front
                      ? "Tap to change image"
                      : "Tap to upload CNIC front (Required)"}
                  </Text>
                </View>

                {/* CNIC Back */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    CNIC Back <Text style={{ color: 'red' }}>*</Text>
                  </Text>
                  <TouchableOpacity
                    style={styles.imagePickerContainer}
                    onPress={async () => {
                      const { status } =
                        await ImagePicker.requestMediaLibraryPermissionsAsync();
                      if (status !== "granted") {
                        alert(
                          "Permission to access media library is required!"
                        );
                        return;
                      }
                      const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        allowsEditing: true,
                        aspect: [4, 3],
                        quality: 1,
                      });
                      if (!result.canceled) {
                        handleChange("cnic_back", result.assets[0].uri);
                      }
                    }}
                  >
                    {formData.cnic_back ? (
                      <Image
                        source={{ uri: formData.cnic_back }}
                        style={styles.profileImage}
                      />
                    ) : (
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color={COLORS.placeholderText}
                        style={styles.cameraIcon}
                      />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.imagePickerText}>
                    {formData.cnic_back
                      ? "Tap to change image"
                      : "Tap to upload CNIC back (Required)"}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSignup}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>

                {/* Footer */}
                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    Already have an account?
                  </Text>
                  <Link href="/(tabs)/login" asChild>
                    <TouchableOpacity>
                      <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}