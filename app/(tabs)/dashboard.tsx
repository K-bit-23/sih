import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import { View, Text } from "@/components/Themed";
import WasteLogList from "../../components/WasteLogList";
import { useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";

const wasteLog = [
  { id: "1", type: "Organic", weight: "1.2 kg", date: "2025-09-08" },
  { id: "2", type: "Recyclable", weight: "0.8 kg", date: "2025-09-07" },
  { id: "3", type: "Hazardous", weight: "0.3 kg", date: "2025-09-07" },
];

const { width } = Dimensions.get("window");

interface CardProps {
  title: string;
  value: string;
  color?: string;
}

const InfoCard = ({ title, value, color }: CardProps) => (
  <View style={[styles.card, { backgroundColor: color || "#e0f2e9" }]}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default function DashboardScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  // Replace with your actual sensor data
  const [temperature] = useState("28°C");
  const [humidity] = useState("65%");
  const videoUrl = ""; // set your stream/video URL here

  const cards = [
    { id: "1", title: "Temperature", value: temperature, color: "#FFECB3" },
    { id: "2", title: "Humidity", value: humidity, color: "#BBDEFB" },
    { id: "3", title: "Recyclable", value: "1.8 kg", color: "#C8E6C9" },
    { id: "4", title: "Non-Recyclable", value: "0.5 kg", color: "#FFCDD2" },
    { id: "5", title: "Hazardous", value: "0.3 kg", color: "#FFE0B2" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Header */}
      <View style={styles.menuBar}>
        <Text style={styles.title}>🌱 Eco Dashboard</Text>
        <Ionicons
          name="menu"
          size={28}
          color="#27ae60"
          onPress={() => setMenuVisible(true)}
        />
      </View>

      {/* Dropdown Modal Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        {/* Background overlay to close menu */}
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/settings");
              }}
            >
              <Ionicons name="settings" size={20} color="#27ae60" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/rewards");
              }}
            >
              <FontAwesome name="gift" size={20} color="#27ae60" />
              <Text style={styles.menuText}>Rewards</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/iot-connect");
              }}
            >
              <Ionicons name="hardware-chip" size={20} color="#27ae60" />
              <Text style={styles.menuText}>IoT Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/maps");
              }}
            >
              <FontAwesome name="map" size={20} color="#27ae60" />
              <Text style={styles.menuText}>Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                router.push("/analysis");
              }}
            >
              <FontAwesome name="line-chart" size={20} color="#27ae60" />
              <Text style={styles.menuText}>Analysis</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Video Section */}
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
            <FontAwesome name="exclamation-triangle" size={30} color="#e74c3c" />
            <Text style={styles.errorText}>No video available</Text>
          </View>
        )}
      </View>

      {/* Cards Grid */}
      <View style={styles.gridContainer}>
        {cards.map((item) => (
          <InfoCard
            key={item.id}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </View>

      {/* Waste Logs */}
      <WasteLogList data={wasteLog} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6fff9" },

  // Header
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#27ae60" },

  // Overlay
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  // Dropdown menu
  dropdownMenu: {
    marginTop: 60,
    marginRight: 12,
    width: 180,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  menuText: {
    fontSize: 15,
    marginLeft: 10,
    fontWeight: "500",
    color: "#333",
  },

  // Video
  videoBox: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  video: {
    width: "95%",
    height: "100%",
    borderRadius: 12,
    backgroundColor: "#000",
  },
  videoError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fdecea",
    width: "95%",
    borderRadius: 12,
  },
  errorText: { marginTop: 8, color: "#e74c3c", fontWeight: "600" },

  // Info Cards
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.44,
    borderRadius: 14,
    paddingVertical: 20,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#145a32" },
  cardValue: { fontSize: 14, fontWeight: "500", color: "#145a32", marginTop: 6 },
});
