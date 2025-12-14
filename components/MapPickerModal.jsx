import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../constants/colors";
import config from "../constants/config";

const { width, height } = Dimensions.get("window");

export default function MapPickerModal({ visible, onClose, onLocationSelect }) {
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Check if API key is configured
  const isApiKeyConfigured = config.GOOGLE_MAPS_API_KEY &&
    config.GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  // HTML content for the map
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            background-color: #ffffff;
            overflow: hidden;
          }
          #map {
            height: 100%;
            width: 100%;
            background-color: #ffffff;
          }
          .info-box {
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            z-index: 1000;
            font-family: Arial, sans-serif;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="info-box">
          <strong>Tap anywhere to select crime location</strong>
        </div>
        <div id="map"></div>

        <script src="https://maps.googleapis.com/maps/api/js?key=${config.GOOGLE_MAPS_API_KEY}"></script>
        <script>
          let map;
          let marker;
          let geocoder;

          function initMap() {
            // Default center (Karachi, Pakistan)
            const defaultCenter = { lat: 24.8607, lng: 67.0011 };

            map = new google.maps.Map(document.getElementById("map"), {
              center: defaultCenter,
              zoom: 12,
              mapTypeControl: true,
              streetViewControl: false,
            });

            geocoder = new google.maps.Geocoder();

            // Add click listener
            map.addListener("click", (event) => {
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();

              // Remove old marker
              if (marker) {
                marker.setMap(null);
              }

              // Add new marker
              marker = new google.maps.Marker({
                position: { lat, lng },
                map: map,
                title: "Selected Location",
                animation: google.maps.Animation.DROP,
              });

              // Reverse geocode to get address and city
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const address = results[0].formatted_address;
                  let city = "";

                  // Extract city from address components - try multiple types
                  results[0].address_components.forEach(component => {
                    // Priority order: locality > sublocality > administrative_area_level_2 > administrative_area_level_1
                    if (component.types.includes("locality")) {
                      city = component.long_name;
                    } else if (!city && component.types.includes("sublocality")) {
                      city = component.long_name;
                    } else if (!city && component.types.includes("sublocality_level_1")) {
                      city = component.long_name;
                    } else if (!city && component.types.includes("administrative_area_level_2")) {
                      city = component.long_name;
                    } else if (!city && component.types.includes("administrative_area_level_1")) {
                      city = component.long_name;
                    } else if (!city && component.types.includes("postal_town")) {
                      city = component.long_name;
                    }
                  });

                  // If still no city, try to extract from formatted address
                  if (!city) {
                    const parts = address.split(',');
                    if (parts.length >= 2) {
                      city = parts[parts.length - 3]?.trim() || parts[parts.length - 2]?.trim() || "Unknown";
                    }
                  }

                  // Send data to React Native
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    address: address,
                    city: city || "Unknown"
                  }));
                } else {
                  // If geocoding fails, still send coordinates
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    latitude: lat,
                    longitude: lng,
                    address: "Location selected",
                    city: "Unknown"
                  }));
                }
              });
            });

            // Try to get user's current location for initial center
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  };
                  map.setCenter(pos);
                },
                () => {
                  // Use default center if geolocation fails
                }
              );
            }
          }

          // Initialize map when page loads
          window.onload = initMap;
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setSelectedLocation(data);
    } catch (error) {
      console.error("Error parsing map data:", error);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect(
        selectedLocation.latitude.toFixed(6),
        selectedLocation.longitude.toFixed(6),
        selectedLocation.city,
        selectedLocation.address
      );
      onClose();
      setSelectedLocation(null);
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.textDark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Crime Location</Text>
          <TouchableOpacity
            onPress={handleConfirm}
            disabled={!selectedLocation}
            style={[
              styles.confirmButton,
              !selectedLocation && styles.confirmButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !selectedLocation && styles.confirmButtonTextDisabled,
              ]}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          {!isApiKeyConfigured ? (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={64} color={COLORS.danger} />
              <Text style={styles.errorTitle}>Google Maps API Key Required</Text>
              <Text style={styles.errorText}>
                To use the map picker, you need to add your Google Maps API key.
              </Text>
              <View style={styles.instructionsBox}>
                <Text style={styles.instructionsTitle}>Quick Setup:</Text>
                <Text style={styles.instructionsText}>
                  1. Open constants/config.js{'\n'}
                  2. Replace YOUR_GOOGLE_MAPS_API_KEY_HERE{'\n'}
                  3. Get free API key from:{'\n'}
                  console.cloud.google.com
                </Text>
              </View>
              <Text style={styles.alternativeText}>
                💡 You can still enter city manually in the form above
              </Text>
            </View>
          ) : (
            <>
              {loading && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Loading map...</Text>
                </View>
              )}

              <WebView
                source={{ html: htmlContent }}
                style={styles.webview}
                onLoadEnd={() => setLoading(false)}
                onMessage={handleMessage}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                geolocationEnabled={true}
                containerStyle={{ backgroundColor: COLORS.white }}
                opacity={1}
              />
            </>
          )}
        </View>

        {/* Selected Location Info */}
        {selectedLocation && (
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={20} color={COLORS.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Selected Location:</Text>
                <Text style={styles.infoText} numberOfLines={2}>
                  {selectedLocation.address}
                </Text>
                <Text style={styles.infoCoords}>
                  Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.infoCity}>City: {selectedLocation.city}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: COLORS.gray,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: "600",
    fontSize: 14,
  },
  confirmButtonTextDisabled: {
    color: COLORS.white,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.white,
    opacity: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.lightGray,
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.gray,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: COLORS.lightGray,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
    marginBottom: 20,
  },
  instructionsBox: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    width: "100%",
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: COLORS.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 20,
  },
  alternativeText: {
    fontSize: 13,
    color: COLORS.primary,
    textAlign: "center",
    fontStyle: "italic",
  },
  infoBox: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.gray,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 4,
  },
  infoCoords: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoCity: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: "600",
  },
});
