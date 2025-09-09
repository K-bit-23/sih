import React from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { View, Text } from "@/components/Themed";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { FontAwesome5 } from "@expo/vector-icons";
import Colors from '@/constants/Colors';

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

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.5;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function MapsScreen() {
  // ✅ Tamil Nadu bins
  const bins = [
    { id: 1, name: "Bin - Erode (TN)", lat: 11.341, lng: 77.7172, type: 'Recyclable' },
    { id: 2, name: "Bin - Thindal (TN)", lat: 11.343, lng: 77.695, type: 'Organic' },
    { id: 3, name: "Bin - Karur (TN)", lat: 10.9601, lng: 78.0766, type: 'Hazardous' },
    { id: 4, name: "Bin - Coimbatore (TN)", lat: 11.0168, lng: 76.9558, type: 'General' },
    { id: 5, name: "Bin - Salem (TN)", lat: 11.6643, lng: 78.1460, type: 'Recyclable' },
  ];

  const initialRegion = {
    latitude: 11.3410,
    longitude: 77.7172,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'Recyclable': return Colors.light.accent;
      case 'Organic': return Colors.light.primary;
      case 'Hazardous': return Colors.light.danger;
      default: return Colors.light.secondary;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
      >
        {bins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={{ latitude: bin.lat, longitude: bin.lng }}
            title={bin.name}
            description={`Type: ${bin.type}`}
            pinColor={getMarkerColor(bin.type)}
          />
        ))}
      </MapView>

      {/* Bins list */}
      <View style={styles.bottomCardContainer}>
        <Text style={styles.subtitle}>Nearby Waste Bins</Text>
        <ScrollView
          style={styles.binList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {bins.map((bin) => (
            <TouchableOpacity
              key={bin.id}
              style={[styles.binCard, { borderTopColor: getMarkerColor(bin.type) }]}
              onPress={() => openDirections(bin.lat, bin.lng)}
            >
              <FontAwesome5 name="trash-alt" size={28} color={getMarkerColor(bin.type)} />
              <Text style={styles.binName}>{bin.name}</Text>
              <Text style={styles.binType}>{bin.type} Waste</Text>
              <Text style={styles.tapText}>➡️ Tap for directions</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.background 
  },
  map: { 
    ...StyleSheet.absoluteFillObject,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 12,
    marginLeft: 16,
  },
  bottomCardContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20, // Added padding for home indicator
  },
  binList: { 
    paddingLeft: 10 
  },
  binCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 16,
    borderTopWidth: 4,
    width: 160,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  binName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 8,
    textAlign: "center",
  },
  binType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  tapText: {
    fontSize: 11,
    color: Colors.light.secondary,
    fontStyle: "italic",
    textAlign: "center",
  },
});