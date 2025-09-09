import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import { View } from '../../../components/Themed';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Colors from '../../../constants/Colors';

export default function SettingsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleResetSettings = () => {
    Alert.alert(
      'Confirm Reset',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            // Add your reset logic here
            Alert.alert('Settings Reset', 'All settings have been reset successfully.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>General Settings</Text>
        <TouchableOpacity style={styles.menuItem} onPress={handleResetSettings}>
            <FontAwesome5 name="undo" size={20} color={Colors.light.primary} />
            <Text style={styles.menuText}>Reset Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Location</Text>
        {errorMsg ? (
          <RNView style={styles.locationContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={openAppSettings}>
              <Text style={styles.settingsText}>Open Settings</Text>
            </TouchableOpacity>
          </RNView>
        ) : location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Your Location"
            />
          </MapView>
        ) : (
          <RNView style={styles.locationContainer}>
            <Text>Loading location...</Text>
          </RNView>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  headerContainer: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.light.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 18,
    marginLeft: 16,
    color: '#333',
  },
  map: {
    height: 300,
    borderRadius: 12,
  },
  locationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  settingsBtn: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  settingsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
