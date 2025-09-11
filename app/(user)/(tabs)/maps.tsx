import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Location from 'expo-location';
import { useLanguage } from '../../context/LanguageContext';

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
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { t } = useLanguage();

  const bins = [
    { id: 1, nameKey: "bin_erode", lat: 11.341, lng: 77.7172, typeKey: 'recyclable' },
    { id: 2, nameKey: "bin_thindal", lat: 11.343, lng: 77.695, typeKey: 'organic' },
    { id: 3, nameKey: "bin_karur", lat: 10.9601, lng: 78.0766, typeKey: 'hazardous' },
    { id: 4, nameKey: "bin_coimbatore", lat: 11.0168, lng: 76.9558, typeKey: 'general' },
    { id: 5, nameKey: "bin_salem", lat: 11.6643, lng: 78.1460, typeKey: 'recyclable' },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in your device settings.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('Could not fetch location. Please ensure your GPS is enabled.');
        console.error("Error fetching location: ", error);
      }
    })();
  }, []);

  const getMarkerColor = (typeKey: string) => {
    switch (typeKey) {
      case 'recyclable': return '#00BCD4';
      case 'organic': return '#4CAF50';
      case 'hazardous': return '#F44336';
      default: return '#FF9800';
    }
  };

  let osmUrl = `https://www.openstreetmap.org/export/embed.html?layer=mapnik`;
  if (location) {
    const { latitude, longitude } = location.coords;
    const zoom = 0.02; 
    const bbox = [
      longitude - zoom,
      latitude - zoom,
      longitude + zoom,
      latitude + zoom,
    ].join(',');
    osmUrl += `&bbox=${bbox}&marker=${latitude},${longitude}`;
  } else {
    osmUrl += `&bbox=76.5,10.5,79.5,12.5`;
  }

  // Add bin markers
  bins.forEach(bin => {
    osmUrl += `&marker=${bin.lat},${bin.lng}`;
  });

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        {errorMsg ? (
          <View style={styles.messageBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : !location ? (
          <View style={styles.messageBox}>
            <ActivityIndicator size="large" color={'#4CAF50'} />
            <Text style={styles.loadingText}>Finding your location...</Text>
          </View>
        ) : (
          <WebView
            source={{ uri: osmUrl }}
            style={styles.map}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
          />
        )}
      </View>

      <View style={styles.bottomCardContainer}>
        <Text style={styles.subtitle}>{t('nearbyBins')}</Text>
        <ScrollView
          style={styles.binList}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {bins.map((bin) => (
            <TouchableOpacity
              key={bin.id}
              style={[styles.binCard, { borderTopColor: getMarkerColor(bin.typeKey) }]}
              onPress={() => openDirections(bin.lat, bin.lng)}
            >
              <FontAwesome5 name="trash-alt" size={28} color={getMarkerColor(bin.typeKey)} />
              <Text style={styles.binName}>{t(bin.nameKey)}</Text>
              <Text style={styles.binType}>{t(bin.typeKey)} Waste</Text>
              <Text style={styles.tapText}>➡️ {t('tapForDirections')}</Text>
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
    backgroundColor: '#fff' 
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f0',
  },
  map: { 
    flex: 1,
    width: '100%',
    height: '100%',
  },
  messageBox: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
    marginLeft: 16,
  },
  bottomCardContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
    color: '#000',
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
    color: '#FF9800',
    fontStyle: "italic",
    textAlign: "center",
  },
});
