import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Image,
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
    { title: "Settings", icon: "cog", color: Colors.light.secondary, route: "/(user)/(tabs)/settings" },
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
            <TouchableOpacity style={styles.headerIcon}>
              <FontAwesome5 name="bluetooth-b" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon} onPress={() => router.push("/(user)/iot-connect" as any)}>
              <FontAwesome5 name="wifi" size={18} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(user)/(tabs)/settings" as any)}>
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

      <View style={[styles.section, styles.quickActionsSection]}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
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
        </View>
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
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
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
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerLeft: { backgroundColor: "transparent" },
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  headerIcon: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatar: { width: 42, height: 42, borderRadius: 21 },
  avatarPlaceholder: {
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { marginTop: 20, paddingLeft: 20 },
  quickActionsSection: { marginTop: -20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 15,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  quickActionCard: {
    alignItems: "center",
    width: (width - 100) / 4,
    marginBottom: 15,
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
  cardsContainer: { paddingBottom: 10, paddingRight: 20 },
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
});