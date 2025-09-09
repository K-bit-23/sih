import {
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { View, Text } from "@/components/Themed";
import { WebView } from "react-native-webview";
import { FontAwesome5 } from "@expo/vector-icons";

// Open directions
function openDirections(lat: number, lng: number) {
  const url =
    Platform.OS === "ios"
      ? `http://maps.apple.com/?daddr=${lat},${lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  Linking.openURL(url).catch(() => {
    // fallback to OSM
    Linking.openURL(`https://www.openstreetmap.org/directions?to=${lat},${lng}`);
  });
}

export default function MapsScreen() {
  // ✅ Tamil Nadu bins
  const bins = [
    { id: 1, name: "Bin - Erode (TN)", lat: 11.341, lng: 77.7172 },
    { id: 2, name: "Bin - Thindal (TN)", lat: 11.343, lng: 77.695 },
    { id: 3, name: "Bin - Karur (TN)", lat: 10.9601, lng: 78.0766 },
  ];

  // Build OSM URL dynamically with marker
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=77.6,10.9,78.1,11.4&layer=mapnik`;

  return (
    <View style={styles.container}>
        <>
          {/* Map */}
          <View style={styles.mapBox}>
            <WebView
              source={{ uri: osmUrl }}
              style={styles.map}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
            />
          </View>

          {/* Bins list */}
          <View style={styles.bottomCardContainer}>
            <Text style={styles.subtitle}>Nearby Waste Bins</Text>
            <ScrollView
              style={styles.binList}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {bins.map((bin) => {

                return (
                  <TouchableOpacity
                    key={bin.id}
                    style={styles.binCard}
                    onPress={() => openDirections(bin.lat, bin.lng)}
                  >
                    <FontAwesome5 name="trash" size={26} color="#27ae60" />
                    <Text style={styles.binName}>{bin.name}</Text>
                    <Text style={styles.tapText}>➡️ Tap for directions</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </>

      {Platform.OS === "web" && (
        <Text style={styles.webText}>
          🌍 Interactive OpenStreetMap available on Web
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eafaf1" },
  mapBox: { flex: 1 },
  map: { flex: 1, width: "100%", height: "100%" },

  messageBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    padding: 16,
  },
  loading: { marginTop: 8, color: "#555", fontSize: 16, textAlign: "center" },
  error: { marginTop: 8, color: "red", fontSize: 16, textAlign: "center" },

  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#145a32",
    marginBottom: 8,
    marginLeft: 12,
  },

  bottomCardContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 10,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 6,
  },
  binList: { paddingHorizontal: 10 },
  binCard: {
    backgroundColor: "#f0fdf4",
    padding: 14,
    marginHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#27ae60",
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  binName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 6,
    textAlign: "center",
  },
  distance: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: "600",
    color: "#27ae60",
  },
  tapText: {
    marginTop: 6,
    fontSize: 12,
    color: "#555",
    fontStyle: "italic",
    textAlign: "center",
  },

  refreshBtn: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    elevation: 5,
  },
  refreshText: { color: "white", fontWeight: "600", marginLeft: 4 },

  retryBtn: {
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#27ae60",
    borderRadius: 8,
  },
  retryText: { color: "white", fontWeight: "600" },

  settingsBtn: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#145a32",
    borderRadius: 8,
  },
  settingsText: { color: "white", fontWeight: "600" },

  webText: {
    marginTop: 12,
    color: "#27ae60",
    fontWeight: "600",
    textAlign: "center",
  },
});
