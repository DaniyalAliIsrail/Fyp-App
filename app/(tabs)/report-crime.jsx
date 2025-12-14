import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createReport, clearReportSuccess, resetReportState } from "../../store/slices/report.slice";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import SafeScreen from "../../components/SafeScreen";
import { encryptReportData } from "../../utils/encrypt";
import client from "../../utils/client";
import MapPicker from "../../components/MapPicker";

export default function ReportCrime() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success, currentUser } = useSelector((state) => state.auth);
  const reportState = useSelector((state) => state.report);

  const [formData, setFormData] = useState({
    crime_type: "",
    description: "",
    incident_datetime: new Date(),
    location_text: "",
    latitude: "",
    longitude: "",
    city: "",
    severity: "Low",
    is_anonymous: false,
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  // Handle success - Navigate to success page
  useEffect(() => {
    console.log("=== SUCCESS EFFECT TRIGGERED ===");
    console.log("reportState.success:", reportState.success);
    console.log("reportState.currentReport:", reportState.currentReport);

    if (reportState.success && reportState.currentReport) {
      console.log("=== NAVIGATING TO SUCCESS PAGE ===");
      console.log("Report Data:", reportState.currentReport);

      // Clear form first
      resetForm();

      // Navigate to success page with report data
      router.push({
        pathname: "/report-success",
        params: {
          reportData: JSON.stringify(reportState.currentReport),
        },
      });
    }
  }, [reportState.success, reportState.currentReport]);

  // Handle error - Show detailed error message
  useEffect(() => {
    if (reportState.error) {
      // Parse error message for better display
      let errorTitle = "Submission Failed";
      let errorMessage = reportState.error;

      // Check if it's a backend error with specific message
      if (reportState.error.includes("Server error:")) {
        errorTitle = "Server Error";
      } else if (reportState.error.includes("Network")) {
        errorTitle = "Network Error";
      } else if (reportState.error.includes("timeout")) {
        errorTitle = "Connection Timeout";
      }

      Alert.alert(
        errorTitle,
        errorMessage,
        [
          {
            text: "Try Again",
            style: "default",
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]
      );
    }
  }, [reportState.error]);

  // REMOVED: The auto-reset useEffect that was still causing crashes


  const resetForm = () => {
    setFormData({
      crime_type: "",
      description: "",
      incident_datetime: new Date(),
      location_text: "",
      latitude: "",
      longitude: "",
      city: "",
      severity: "Low",
      is_anonymous: false,
    });
    setSelectedImages([]);
    setSelectedVideos([]);
    setSelectedDocuments([]);
    dispatch(resetReportState());
  };

  const handleDateTimeInput = (text) => {
    // Parse manual date/time input in format: YYYY-MM-DD HH:MM
    try {
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        setFormData(prev => ({ ...prev, incident_datetime: date }));
        console.log("Date updated:", date);
      }
    } catch (e) {
      console.log("Invalid date format");
    }
  };

  const formatDateForInput = (date) => {
    // Format: YYYY-MM-DD HH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const setToCurrentDateTime = () => {
    setFormData(prev => ({ ...prev, incident_datetime: new Date() }));
  };

  const adjustDate = (days) => {
    const newDate = new Date(formData.incident_datetime);
    newDate.setDate(newDate.getDate() + days);
    setFormData(prev => ({ ...prev, incident_datetime: newDate }));
  };

  const adjustHours = (hours) => {
    const newDate = new Date(formData.incident_datetime);
    newDate.setHours(newDate.getHours() + hours);
    setFormData(prev => ({ ...prev, incident_datetime: newDate }));
  };

  const handleLocationSelect = (lat, lng, city = "") => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
      city: city,
    });
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant photo library permission");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImages([...selectedImages, ...result.assets]);
    }
  };

  const pickVideos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please grant photo library permission");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedVideos([...selectedVideos, ...result.assets]);
    }
  };

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"],
        multiple: true,
      });

      if (!result.canceled) {
        setSelectedDocuments([...selectedDocuments, ...result.assets]);
      }
    } catch (error) {
      console.log("Document picker error:", error);
    }
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const removeVideo = (index) => {
    setSelectedVideos(selectedVideos.filter((_, i) => i !== index));
  };

  const removeDocument = (index) => {
    setSelectedDocuments(selectedDocuments.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.crime_type.trim()) {
      Alert.alert("Error", "Please enter crime type");
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter description");
      return;
    }
    if (!formData.location_text.trim()) {
      Alert.alert("Error", "Please enter location");
      return;
    }

    try {
      // Prepare data for encryption
      const reportData = {
        crime_type: formData.crime_type,
        description: formData.description,
        incident_datetime: formData.incident_datetime.toISOString(),
        location_text: formData.location_text,
        severity: formData.severity,
        is_anonymous: formData.is_anonymous,
        reporter_id: currentUser?.id,
      };

      // Add latitude, longitude, and city if available
      if (formData.latitude) {
        reportData.latitude = formData.latitude;
      }
      if (formData.longitude) {
        reportData.longitude = formData.longitude;
      }
      if (formData.city) {
        reportData.city = formData.city;
      }

      console.log("=== Encrypting report data ===");

      // Encrypt the report data
      const baseURL = client.defaults.baseURL;
      const encryptedPayload = await encryptReportData(reportData, baseURL);

      console.log("=== Creating FormData with encrypted payload ===");

      // Create FormData with encrypted data
      const submitData = new FormData();
      submitData.append("encryptedKey", encryptedPayload.encryptedKey);
      submitData.append("iv", encryptedPayload.iv);
      submitData.append("encryptedData", encryptedPayload.encryptedData);

      // Add images
      selectedImages.forEach((image, index) => {
        submitData.append("report_image", {
          uri: image.uri,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      // Add videos
      selectedVideos.forEach((video, index) => {
        submitData.append("report_video", {
          uri: video.uri,
          type: "video/mp4",
          name: `video_${index}.mp4`,
        });
      });

      // Add documents
      selectedDocuments.forEach((doc, index) => {
        submitData.append("report_document", {
          uri: doc.uri,
          type: doc.mimeType || "application/pdf",
          name: doc.name || `document_${index}.pdf`,
        });
      });

      console.log("=== Submitting report ===");

      // Submit report - response will be stored in reportState.currentReport
      await dispatch(createReport(submitData)).unwrap();
    } catch (error) {
      console.log("Submit error:", error);
      // Don't show alert here - let the useEffect handle it
      // The error is already in reportState.error
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.lightGray }}
        contentContainerStyle={{ padding: 20 }}
      >
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", color: COLORS.primary }}>
            Report a Crime
          </Text>
          <Text style={{ fontSize: 14, color: COLORS.gray, marginTop: 5 }}>
            Fill in the details below to report a crime
          </Text>
        </View>

        {/* Crime Type */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            Crime Type *
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="alert-circle-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="e.g., Theft, Assault, Vandalism"
              value={formData.crime_type}
              onChangeText={(text) => setFormData({ ...formData, crime_type: text })}
            />
          </View>
        </View>

        {/* Description */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            Description *
          </Text>
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <TextInput
              style={{ paddingVertical: 12, minHeight: 100, textAlignVertical: "top" }}
              placeholder="Describe the incident in detail"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        {/* Incident Date & Time - FIXED: Manual Input to avoid DateTimePicker crash */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            Incident Date & Time *
          </Text>

          {/* Current Date/Time Display */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.lightGray,
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
              marginBottom: 8,
            }}
          >
            <Ionicons name="calendar" size={20} color={COLORS.primary} />
            <Text style={{ marginLeft: 10, flex: 1, fontWeight: "600", color: COLORS.textDark }}>
              {formData.incident_datetime.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
            <TouchableOpacity
              onPress={setToCurrentDateTime}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.primary,
                paddingVertical: 8,
                borderRadius: 6,
                gap: 4,
              }}
            >
              <Ionicons name="time" size={16} color={COLORS.white} />
              <Text style={{ color: COLORS.white, fontSize: 12, fontWeight: "600" }}>Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => adjustDate(-1)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                paddingVertical: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: COLORS.border,
                gap: 4,
              }}
            >
              <Ionicons name="remove-circle-outline" size={16} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: "600" }}>-1 Day</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => adjustHours(-1)}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
                paddingVertical: 8,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: COLORS.border,
                gap: 4,
              }}
            >
              <Ionicons name="time-outline" size={16} color={COLORS.primary} />
              <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: "600" }}>-1 Hour</Text>
            </TouchableOpacity>
          </View>

          {/* Manual Input */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="create-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="YYYY-MM-DD HH:MM"
              value={formatDateForInput(formData.incident_datetime)}
              onChangeText={handleDateTimeInput}
              keyboardType="numbers-and-punctuation"
            />
          </View>
          <Text style={{ fontSize: 11, color: COLORS.gray, marginTop: 4, marginLeft: 4 }}>
            Format: YYYY-MM-DD HH:MM (e.g., 2025-11-23 14:30)
          </Text>
        </View>

        {/* Location */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            Location *
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="Enter location address"
              value={formData.location_text}
              onChangeText={(text) => setFormData({ ...formData, location_text: text })}
            />
          </View>
        </View>

        {/* City */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            City *
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              borderRadius: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="business-outline" size={20} color={COLORS.primary} />
            <TextInput
              style={{ flex: 1, paddingVertical: 12, paddingHorizontal: 10 }}
              placeholder="e.g., Karachi, Lahore, Islamabad"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
          </View>
        </View>

        {/* Map Location Picker */}
        <MapPicker
          latitude={formData.latitude ? parseFloat(formData.latitude) : null}
          longitude={formData.longitude ? parseFloat(formData.longitude) : null}
          city={formData.city}
          onLocationSelect={handleLocationSelect}
        />

        {/* Severity */}
        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 5 }}>
            Severity Level
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            {["Low", "Medium", "High"].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => setFormData({ ...formData, severity: level })}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: formData.severity === level ? COLORS.primary : COLORS.border,
                  backgroundColor: formData.severity === level ? COLORS.primary : COLORS.white,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: formData.severity === level ? COLORS.white : COLORS.primary,
                    fontWeight: "600",
                  }}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Anonymous Report */}
        <TouchableOpacity
          onPress={() => setFormData({ ...formData, is_anonymous: !formData.is_anonymous })}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            backgroundColor: COLORS.white,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons
            name={formData.is_anonymous ? "checkbox" : "square-outline"}
            size={24}
            color={COLORS.primary}
          />
          <Text style={{ marginLeft: 10, fontSize: 14 }}>Submit Anonymously</Text>
        </TouchableOpacity>

        {/* File Uploads */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>
            Attach Evidence (Optional)
          </Text>

          {/* Images */}
          <TouchableOpacity
            onPress={pickImages}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="images-outline" size={24} color={COLORS.primary} />
            <Text style={{ marginLeft: 10, flex: 1 }}>Upload Images</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
          {selectedImages.map((image, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGray,
                padding: 8,
                borderRadius: 6,
                marginBottom: 5,
              }}
            >
              <Ionicons name="image" size={16} color={COLORS.primary} />
              <Text style={{ flex: 1, marginLeft: 8, fontSize: 12 }}>Image {index + 1}</Text>
              <TouchableOpacity onPress={() => removeImage(index)}>
                <Ionicons name="close-circle" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Videos */}
          <TouchableOpacity
            onPress={pickVideos}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
            <Text style={{ marginLeft: 10, flex: 1 }}>Upload Videos</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
          {selectedVideos.map((video, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGray,
                padding: 8,
                borderRadius: 6,
                marginBottom: 5,
              }}
            >
              <Ionicons name="videocam" size={16} color={COLORS.primary} />
              <Text style={{ flex: 1, marginLeft: 8, fontSize: 12 }}>Video {index + 1}</Text>
              <TouchableOpacity onPress={() => removeVideo(index)}>
                <Ionicons name="close-circle" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Documents */}
          <TouchableOpacity
            onPress={pickDocuments}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.white,
              padding: 12,
              borderRadius: 8,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <Ionicons name="document-outline" size={24} color={COLORS.primary} />
            <Text style={{ marginLeft: 10, flex: 1 }}>Upload Documents</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
          {selectedDocuments.map((doc, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.lightGray,
                padding: 8,
                borderRadius: 6,
                marginBottom: 5,
              }}
            >
              <Ionicons name="document" size={16} color={COLORS.primary} />
              <Text style={{ flex: 1, marginLeft: 8, fontSize: 12 }}>{doc.name}</Text>
              <TouchableOpacity onPress={() => removeDocument(index)}>
                <Ionicons name="close-circle" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={reportState.loading}
          style={{
            backgroundColor: COLORS.primary,
            paddingVertical: 15,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          {reportState.loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={{ color: COLORS.white, fontSize: 16, fontWeight: "bold" }}>
              Submit Report
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeScreen>
  );
}
