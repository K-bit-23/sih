import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
  Animated,
  Easing,
  Modal,
  FlatList,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { View, Text } from "@/components/Themed";
import WasteLogList from "@/components/WasteLogList";
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BleManager, Device } from "react-native-ble-plx";

const wasteLog = [
  { id: "1", type: "Organic", weight: "1.2 kg", date: "2025-01-08", status: "Processed" },
  { id: "2", type: "Recyclable", weight: "0.8 kg", date: "2025-01-07", status: "Collected" },
  { id: "3", type: "Hazardous", weight: "0.3 kg", date: "2025-01-07", status: "Pending" },
  { id: "4", type: "Organic", weight: "2.1 kg", date: "2025-01-06", status: "Processed" },
  { id: "5", type: "Plastic", weight: "0.5 kg", date: "2025-01-06", status: "Collected" },
];

const { width } = Dimensions.get("window");

interface CardProps {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

const InfoCard = ({ title, value, icon, color }: CardProps) => (
  <View style={[styles.card, { backgroundColor: color }]}>
    <FontAwesome name={icon} size={18} color="white" style={styles.cardIcon} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "Good Morning! 🌱";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "Good Afternoon! ☀️";
  } else {
    return "Good Evening! 🌙";
  }
};

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [greeting, setGreeting] = useState("");
  const [isBluetoothModalVisible, setBluetoothModalVisible] = useState(false);
  const [discoveredDevices, setDiscoveredDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const bleManager = new BleManager();

  const orbitAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(orbitAnim, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotation = orbitAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Bluetooth Permission',
          message: 'This app needs access to your location to use Bluetooth.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      return true;
    }
  };

  const scanForDevices = async () => {
    const hasPermission = await requestBluetoothPermission();
    if (!hasPermission) {
      Alert.alert('Permission required', 'Location permission is required for Bluetooth scanning.');
      return;
    }

    bleManager.startDeviceScan(null, null, (error, device) => {
      setIsScanning(true);
      if (error) {
        console.error(error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDiscoveredDevices((prev) => {
          if (!prev.find((d) => d.id === device.id)) {
            return [...prev, device];
          }
          return prev;
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 5000);
  };

  const toggleBluetoothModal = () => {
    if (!isBluetoothModalVisible) {
        scanForDevices();
    }
    setBluetoothModalVisible(!isBluetoothModalVisible);
  };

  const handleDeviceConnect = (device: Device) => {
    Alert.alert(
      "Device Connected",
      `Successfully connected to ${device.name}`,
      [{ text: "OK" }]
    );
    setBluetoothModalVisible(false);
  };

  const [temperature] = useState("28°C");
  const [humidity] = useState("65%");
  const [airQuality] = useState("Good");
  const videoUrl = "";

  useEffect(() => {
    setGreeting(getGreeting());
    checkLocationStatus();
    loadDashboardData();
    loadUserProfile();
  }, []);

  const checkLocationStatus = async () => {
    try {
      const locationStatus = await AsyncStorage.getItem("locationEnabled");
      if (locationStatus) {
        const isEnabled = JSON.parse(locationStatus);
        setLocationEnabled(isEnabled);
        if (isEnabled) {
          getCurrentLocation();
        }
      }
    } catch (error) {
      console.error("Error checking location status:", error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        if (address[0]) {
          setCurrentLocation(`${address[0].city}, ${address[0].region}`);
        }
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem("userProfile");
      if (profile) {
        setUserProfile(JSON.parse(profile));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const loadDashboardData = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const onRefresh = () => {
    setGreeting(getGreeting());
    loadDashboardData();
    if (locationEnabled) {
      getCurrentLocation();
    }
    loadUserProfile();
  };

  const cards: CardProps[] = [
    { title: "Temperature", value: temperature, icon: "thermometer-three-quarters", color: Colors.light.primary },
    { title: "Humidity", value: humidity, icon: "tint", color: Colors.light.primary },
    { title: "Air Quality", value: airQuality, icon: "leaf", color: Colors.light.accent },
    { title: "Recyclable", value: "1.8 kg", icon: "recycle", color: Colors.light.accent },
  ];

  const quickActions = [
    { title: "Scan Waste", icon: "camera", color: Colors.light.primary, route: "/(user)/(tabs)/analysis" },
    { title: "Find Bins", icon: "map-marker", color: Colors.light.accent, route: "/(user)/(tabs)/maps" },
    { title: "Community", icon: "group", color: "#3498db", route: "/(user)/community" },
    { title: "Education", icon: "book", color: "#9b59b6", route: "/(user)/education" },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{userProfile?.name || "User"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={[styles.orbitContainer, { transform: [{ rotate: rotation }] }]}>
              <TouchableOpacity style={[styles.orbitIcon, styles.orbitIcon1]} onPress={() => router.push("/(user)/(tabs)/iot-connect" as any)}>
                <FontAwesome5 name="wifi" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.orbitIcon, styles.orbitIcon2]} onPress={toggleBluetoothModal}>
                <FontAwesome5 name="bluetooth-b" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.orbitIcon, styles.orbitIcon3]} onPress={() => router.push("/(user)/rewards" as any)}>
                <FontAwesome5 name="trophy" size={16} color="white" />
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity onPress={() => router.push("/(user)/(tabs)/settings" as any)} style={styles.avatarButton}>
              {userProfile?.avatar ? (
                <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <FontAwesome5 name="user" size={18} color={Colors.light.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {locationEnabled && currentLocation && (
          <View style={styles.locationContainer}>
            <Ionicons name="location-sharp" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.location}>{currentLocation}</Text>
          </View>
        )}
      </LinearGradient>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isBluetoothModalVisible}
        onRequestClose={toggleBluetoothModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{isScanning ? "Scanning..." : "Nearby Devices"}</Text>
            {isScanning ? (
              <View style={styles.scanningContainer}>
                <Animated.View style={[styles.scanningDot, { transform: [{ rotate: rotation }] }]}>
                  <FontAwesome5 name="bluetooth-b" size={24} color={Colors.light.primary} />
                </Animated.View>
                <Text style={styles.scanningText}>Looking for devices...</Text>
              </View>
            ) : (
              <FlatList
                data={discoveredDevices}
                keyExtractor={(item) => item.id}
                style={{ width: "100%" }}
                renderItem={({ item }) => (
                  <View style={styles.deviceItem}>
                    <View style={styles.deviceInfo}>
                      <FontAwesome5 name="microchip" size={20} color={Colors.light.primary} />
                      <Text style={styles.deviceName}>{item.name}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.connectButton}
                      onPress={() => handleDeviceConnect(item)}
                    >
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                  </View>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyDevices}>
                    <FontAwesome5 name="search" size={32} color={Colors.light.text + '60'} />
                    <Text style={styles.emptyText}>No devices found</Text>
                    <TouchableOpacity style={styles.rescanButton} onPress={scanForDevices}>
                      <Text style={styles.rescanText}>Scan Again</Text>
                    </TouchableOpacity>
                  </View>
                }
              />
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleBluetoothModal}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsContainer}
        >
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.quickActionCard}
              onPress={() => router.push(action.route as any)}
            >
              <View style={[styles.quickActionCircle, { backgroundColor: action.color }]}>
                <FontAwesome name={action.icon as any} size={22} color="white" />
              </View>
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Data</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {cards.map((item, index) => <InfoCard key={index} {...item} />)}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Live Feed</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.videoBox}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isMuted
            />
          ) : (
            <View style={styles.videoError}>
              <MaterialIcons name="videocam-off" size={32} color={Colors.light.text} />
              <Text style={styles.errorText}>Camera Offline</Text>
              <Text style={styles.errorSubText}>Connect your IoT camera to view live feed</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <WasteLogList data={wasteLog.slice(0, 3)} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  headerLeft: { backgroundColor: "transparent", flex: 1 },
  greeting: { fontSize: 16, color: "rgba(255,255,255,0.9)" },
  username: { fontSize: 24, fontWeight: "bold", color: "white" },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "transparent",
  },
  location: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginLeft: 5 },
  headerRight: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  avatarButton: {
    zIndex: 1,
  },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarPlaceholder: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  orbitContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  orbitIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  orbitIcon1: { transform: [{ translateY: -45 }] },
  orbitIcon2: { transform: [{ translateX: -45 }] },
  orbitIcon3: { transform: [{ translateX: 45 }] },
  section: { marginTop: 25, paddingHorizontal: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: "600",
  },
  quickActionsContainer: {
    paddingHorizontal: 0,
  },
  quickActionCard: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  quickActionCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  cardsContainer: { paddingLeft: 0, paddingBottom: 10, paddingRight: 5 },
  card: {
    width: 140,
    height: 120,
    borderRadius: 20,
    padding: 15,
    marginRight: 15,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  cardIcon: { marginBottom: 10 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.9)",
    backgroundColor: "transparent",
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    backgroundColor: "transparent",
    alignSelf: "flex-end",
  },
  videoBox: {
    width: width - 40,
    height: 180,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: Colors.light.card,
    alignSelf: "center",
  },
  video: { width: "100%", height: "100%" },
  videoError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
  },
  errorText: {
    marginTop: 8,
    color: Colors.light.text,
    fontWeight: "600",
    fontSize: 14,
  },
  errorSubText: {
    marginTop: 4,
    color: Colors.light.text + '80',
    fontSize: 12,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.light.text,
  },
  scanningContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  scanningDot: {
    marginBottom: 20,
  },
  scanningText: {
    fontSize: 16,
    color: Colors.light.text + '80',
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    color: Colors.light.text,
    marginLeft: 12,
    fontWeight: "500",
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  connectButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyDevices: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.light.text + '80',
    marginTop: 12,
    marginBottom: 20,
  },
  rescanButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rescanText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  closeButton: {
    backgroundColor: Colors.light.accent,
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});