import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput } from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import MapPickerModal from "./MapPickerModal";

export default function MapPicker({ latitude, longitude, city, onLocationSelect }) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Get user's current location
  const getCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Please grant location permission to use this feature"
        );
        setLoadingLocation(false);
        return;
      }

      // Get current position
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude: lat, longitude: lng } = location.coords;

      // Notify parent component (no city for GPS - just current location)
      onLocationSelect(lat.toFixed(6), lng.toFixed(6), "");

      Alert.alert(
        "Location Updated",
        `GPS Coordinates set to:\nLat: ${lat.toFixed(6)}\nLng: ${lng.toFixed(6)}\n\nNote: Use 'Select on Map' for crime location with city.`
      );

      setLoadingLocation(false);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Error", "Failed to get current location. Please enter manually.");
      setLoadingLocation(false);
    }
  };

  const handleMapLocationSelect = (lat, lng, selectedCity, address) => {
    onLocationSelect(lat, lng, selectedCity);
    setShowMapModal(false);
  };

  return (
    <View style={styles.container}>
      <MapPickerModal
        visible={showMapModal}
        onClose={() => setShowMapModal(false)}
        onLocationSelect={handleMapLocationSelect}
      />

      <View style={styles.header}>
        <Text style={styles.headerText}>Crime Location</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => setShowMapModal(true)}
          >
            <Ionicons name="map" size={16} color={COLORS.white} />
            <Text style={styles.mapButtonText}>Select on Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.gpsButton}
            onPress={getCurrentLocation}
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="locate" size={16} color={COLORS.white} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.hint}>
        🗺️ Tap "Select on Map" to choose crime location and get city automatically
      </Text>

      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Latitude *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 24.8607"
            value={latitude?.toString() || ''}
            onChangeText={(text) => onLocationSelect(text, longitude?.toString() || '')}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Longitude *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 67.0011"
            value={longitude?.toString() || ''}
            onChangeText={(text) => onLocationSelect(latitude?.toString() || '', text)}
            keyboardType="numeric"
          />
        </View>
      </View>

      {latitude && longitude && (
        <View style={styles.coordinates}>
          <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.coordinatesText}>
              📍 {parseFloat(latitude).toFixed(4)}, {parseFloat(longitude).toFixed(4)}
            </Text>
            {city && (
              <Text style={styles.cityText}>
                🏙️ City: {city}
              </Text>
            )}
          </View>
        </View>
      )}

      <View style={styles.helpBox}>
        <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
        <Text style={styles.helpText}>
          <Text style={{ fontWeight: '600' }}>How to get coordinates:</Text>{'\n'}
          1. Open Google Maps{'\n'}
          2. Long press on crime location{'\n'}
          3. Tap coordinates to copy{'\n'}
          4. Paste here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  mapButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },
  gpsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  cityText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: "600",
    marginTop: 4,
  },
  hint: {
    fontSize: 12,
    color: COLORS.gray,
    marginBottom: 12,
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: COLORS.textDark,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontSize: 14,
  },
  coordinates: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  coordinatesText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "500",
  },
  helpBox: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
    marginTop: 10,
  },
  helpText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textDark,
    lineHeight: 18,
  },
});
