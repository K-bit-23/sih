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
import { FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Colors from '../../../constants/Colors';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied. Please enable it in your device settings.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
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
            Alert.alert('Settings Reset', 'All settings have been reset successfully.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: () => {
            // Perform logout action here
            Alert.alert('Logged Out', 'You have been successfully logged out.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const openAppSettings = () => {
    Linking.openSettings();
  };

  const centerMapOnUser = () => {
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account Actions</Text>
        <TouchableOpacity style={styles.button} onPress={handleResetSettings}>
            <FontAwesome5 name="undo" size={20} color="#fff" />
            <Text style={styles.buttonText}>Reset Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Device</Text>
        <Link href="/(user)/(tabs)/iot-connect" asChild>
            <TouchableOpacity style={styles.button}>
                <FontAwesome5 name="robot" size={20} color="#fff" />
                <Text style={styles.buttonText}>Device Connection</Text>
            </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.card}>
        <RNView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.cardTitle}>My Location</Text>
            <TouchableOpacity onPress={centerMapOnUser}>
                <FontAwesome5 name="compress-arrows-alt" size={20} color={Colors.light.primary} />
            </TouchableOpacity>
        </RNView>
        {errorMsg ? (
          <RNView style={styles.locationContainer}>
            <Text style={styles.errorText}>{errorMsg}</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={openAppSettings}>
              <Text style={styles.settingsText}>Open Settings</Text>
            </TouchableOpacity>
          </RNView>
        ) : region ? (
          <MapView
            style={styles.map}
            region={region}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            showsUserLocation
            loadingEnabled
          >
            {location && <Marker
              coordinate={{
                latitude: location!.coords.latitude,
                longitude: location!.coords.longitude,
              }}
              title="You are here"
              description="Your current location"
              pinColor={Colors.light.accent}
            />}
          </MapView>
        ) : (
          <RNView style={styles.locationContainer}>
            <Text>Fetching your location...</Text>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
