import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import client from "../utils/client";
import { signInSucess } from "../store/slices/auth.slice";
import COLORS from "../constants/colors";

export default function EditProfile() {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstname: currentUser?.firstname || "",
    lastname: currentUser?.lastname || "",
    phone: currentUser?.phone || currentUser?.phone_no || "",
    cnic_front: null,
    cnic_back: null,
    profile_image: null,
  });

  // Preview URIs for images
  const [previews, setPreviews] = useState({
    profile_image: currentUser?.profile_image || null,
    cnic_front: currentUser?.cnic_front || null,
    cnic_back: currentUser?.cnic_back || null,
  });

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async (imageType) => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need camera roll permissions to select images.");
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: imageType === "profile_image" ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // Create file object for upload
        const fileUri = asset.uri;
        const fileName = fileUri.split("/").pop() || `${imageType}_${Date.now()}.jpg`;

        // Determine file type from URI or default to jpeg
        let fileType = 'image/jpeg';
        if (asset.mimeType) {
          fileType = asset.mimeType;
        } else if (fileName.includes('.')) {
          const extension = fileName.split('.').pop().toLowerCase();
          fileType = `image/${extension}`;
        }

        const file = {
          uri: fileUri,
          name: fileName,
          type: fileType,
        };

        console.log(`=== Image picked for ${imageType} ===`);
        console.log("File:", file);

        // Update form and preview
        setForm((prev) => ({ ...prev, [imageType]: file }));
        setPreviews((prev) => ({ ...prev, [imageType]: fileUri }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      // Add text fields only if they have values
      if (form.firstname) formData.append("firstname", form.firstname);
      if (form.lastname) formData.append("lastname", form.lastname);
      if (form.phone) formData.append("phone", form.phone);

      // Add image files only if they are new uploads (have uri property)
      if (form.profile_image && form.profile_image.uri) {
        const imageType = form.profile_image.type || 'image/jpeg';
        formData.append("profile_image", {
          uri: form.profile_image.uri,
          type: imageType,
          name: form.profile_image.name || 'profile.jpg',
        });
      }
      if (form.cnic_front && form.cnic_front.uri) {
        const imageType = form.cnic_front.type || 'image/jpeg';
        formData.append("cnic_front", {
          uri: form.cnic_front.uri,
          type: imageType,
          name: form.cnic_front.name || 'cnic_front.jpg',
        });
      }
      if (form.cnic_back && form.cnic_back.uri) {
        const imageType = form.cnic_back.type || 'image/jpeg';
        formData.append("cnic_back", {
          uri: form.cnic_back.uri,
          type: imageType,
          name: form.cnic_back.name || 'cnic_back.jpg',
        });
      }

      console.log("=== Submitting Profile Update ===");
      console.log("User ID:", currentUser.id);
      console.log("Form Data Fields:", {
        firstname: form.firstname,
        lastname: form.lastname,
        phone: form.phone,
        has_profile_image: !!(form.profile_image && form.profile_image.uri),
        has_cnic_front: !!(form.cnic_front && form.cnic_front.uri),
        has_cnic_back: !!(form.cnic_back && form.cnic_back.uri),
      });

      // Make API call
      const response = await client.put(
        `user/update/${currentUser.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("=== Profile Update Response ===");
      console.log("Response:", response.data);

      // Update Redux store with new user data
      if (response.data && response.data.data) {
        dispatch(signInSucess(response.data.data));
        Alert.alert("Success", "Profile updated successfully!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      console.error("=== Update profile error ===");
      console.error("Error:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      console.error("Error Response:", error.response?.data);
      console.error("Error Status:", error.response?.status);
      console.error("Request URL:", error.config?.url);

      let errorMessage = "Failed to update profile";

      if (error.message === "Network Error") {
        errorMessage = "Network error. Please check your connection and ensure the server is running.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Image Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => pickImage("profile_image")}
          >
            {previews.profile_image ? (
              <Image
                source={{ uri: previews.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={60} color="#999" />
              </View>
            )}
            <View style={styles.editImageBadge}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.imageHint}>Tap to change profile picture</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter first name"
              value={form.firstname}
              onChangeText={(value) => handleChange("firstname", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter last name"
              value={form.lastname}
              onChangeText={(value) => handleChange("lastname", value)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={form.phone}
              onChangeText={(value) => {
                // Only allow digits and limit to 11 characters
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 11) {
                  handleChange("phone", numericValue);
                }
              }}
              keyboardType="phone-pad"
              maxLength={11}
            />
          </View>

          {/* CNIC Images */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC Front Image</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage("cnic_front")}
            >
              {previews.cnic_front ? (
                <Image
                  source={{ uri: previews.cnic_front }}
                  style={styles.cnicPreview}
                />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="card-outline" size={40} color="#999" />
                  <Text style={styles.imagePickerText}>
                    Tap to upload CNIC front
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CNIC Back Image</Text>
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => pickImage("cnic_back")}
            >
              {previews.cnic_back ? (
                <Image
                  source={{ uri: previews.cnic_back }}
                  style={styles.cnicPreview}
                />
              ) : (
                <View style={styles.imagePickerPlaceholder}>
                  <Ionicons name="card-outline" size={40} color="#999" />
                  <Text style={styles.imagePickerText}>
                    Tap to upload CNIC back
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
              <Text style={styles.submitButtonText}>Update Profile</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "white",
    marginBottom: 20,
  },
  profileImageContainer: {
    position: "relative",
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
  editImageBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary || "#2b303a",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  imageHint: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  formSection: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2b303a",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  imagePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  imagePickerPlaceholder: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerText: {
    marginTop: 10,
    fontSize: 14,
    color: "#999",
  },
  cnicPreview: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  submitButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary || "#2b303a",
    marginHorizontal: 20,
    marginTop: 20,
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
  submitButtonDisabled: {
    backgroundColor: "#999",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 10,
  },
});
