import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { View, Text } from "@/components/Themed";
import WasteLogList from "@/components/WasteLogList";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import Colors from "@/constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
  trend?: string;
}

const InfoCard = ({ title, value, icon, color, trend }: CardProps) => (
  <LinearGradient
    colors={[color, color + 'CC']}
    style={styles.card}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.cardHeader}>
      <FontAwesome name={icon} size={24} color="white" />
      {trend && (
        <View style={styles.trendContainer}>
          <Ionicons 
            name={trend.startsWith('+') ? 'trending-up' : 'trending-down'} 
            size={16} 
            color="white" 
          />
          <Text style={styles.trendText}>{trend}</Text>
        </View>
      )}
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </LinearGradient>
);

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string>('');

  const [temperature] = useState("28°C");
  const [humidity] = useState("65%");
  const [airQuality] = useState("Good");
  const videoUrl = "";

  useEffect(() => {
    checkLocationStatus();
    loadDashboardData();
  }, []);

  const checkLocationStatus = async () => {
    try {
      const locationStatus = await AsyncStorage.getItem('locationEnabled');
      if (locationStatus) {
        setLocationEnabled(JSON.parse(locationStatus));
        if (JSON.parse(locationStatus)) {
          getCurrentLocation();
        }
      }
    } catch (error) {
      console.error('Error checking location status:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
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
      console.error('Error getting location:', error);
    }
  };

  const loadDashboardData = async () => {
    // Simulate loading data
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    loadDashboardData();
    if (locationEnabled) {
      getCurrentLocation();
    }
  };

  const cards: CardProps[] = [
    {
      title: "Temperature",
      value: temperature,
      icon: "thermometer-three-quarters",
      color: Colors.light.primary, // Blue for general info
      trend: "+2°C"
    },
    {
      title: "Humidity",
      value: humidity,
      icon: "tint",
      color: Colors.light.primary, // Blue for general info
      trend: "-5%"
    },
    {
      title: "Air Quality",
      value: airQuality,
      icon: "leaf",
      color: Colors.light.accent, // Green for positive metric
      trend: "Good"
    },
    {
      title: "Recyclable",
      value: "1.8 kg",
      icon: "recycle",
      color: Colors.light.accent, // Green for positive metric
      trend: "+0.3kg"
    },
    {
      title: "Non-Recyclable",
      value: "0.5 kg",
      icon: "trash",
      color: Colors.light.secondary, // Orange for neutral/warning
      trend: "-0.2kg"
    },
    {
      title: "Hazardous",
      value: "0.3 kg",
      icon: "warning",
      color: Colors.light.danger, // Red for negative metric
      trend: "0kg"
    },
  ];

  const quickActions = [
    { 
      title: "Scan Waste", 
      icon: "camera", 
      color: Colors.light.primary,
      route: "/(user)/(tabs)/analysis"
    },
    { 
      title: "Find Bins", 
      icon: "map-marker", 
      color: Colors.light.accent,
      route: "/(user)/(tabs)/maps"
    },
    { 
      title: "IoT Connect", 
      icon: "wifi", 
      color: Colors.light.secondary,
      route: "/(user)/(tabs)/iot-connect"
    },
    { 
      title: "Rewards", 
      icon: "trophy", 
      color: "#FFD93D",
      route: "/(user)/(tabs)/rewards"
    },
  ];

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <StatusBar hidden />

      {/* Header */}
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good Morning! 🌱</Text>
            <Text style={[styles.title, { color: Colors.light.accent }]}>Eco Dashboard</Text>
            {locationEnabled && currentLocation && (
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.location}>{currentLocation}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push('/(user)/(tabs)/settings')}
          >
            <FontAwesome name="user-circle-o" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickActionCard, { backgroundColor: action.color }]}
              onPress={() => router.push(action.route as any)}
            >
              <FontAwesome name={action.icon as any} size={24} color="white" />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Live Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Live Feed</Text>
        <View style={styles.videoBox}>
          {videoUrl ? (
            <Video
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
            />
          ) : (
            <View style={styles.videoError}>
              <MaterialIcons name="videocam-off" size={40} color={Colors.light.text} />
              <Text style={styles.errorText}>Camera Offline</Text>
              <Text style={styles.errorSubText}>Check your IoT device connection</Text>
            </View>
          )}
        </View>
      </View>

      {/* Environmental Data */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Environmental Data</Text>
        <View style={styles.gridContainer}>
          {cards.map((item, index) => (
            <InfoCard
              key={index}
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              trend={item.trend}
            />
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <WasteLogList data={wasteLog} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.light.background 
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
  profileButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.primary,
    marginBottom: 15,
  },
  quickActionsContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 48) / 2,
    aspectRatio: 1.5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  videoBox: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  videoError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.card,
    padding: 20,
  },
  errorText: { 
    marginTop: 12, 
    color: Colors.light.text, 
    fontWeight: "600",
    fontSize: 16,
  },
  errorSubText: {
    marginTop: 4,
    color: Colors.light.text + '80',
    fontSize: 14,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: (width - 48) / 2,
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  cardTitle: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: 'white',
    marginBottom: 4,
  },
  cardValue: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: 'white',
  },
});
