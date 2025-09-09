import React, { useState } from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { View, Text } from "@/components/Themed";
import WasteLogList from "@/components/WasteLogList";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import Colors from "@/constants/Colors";

const wasteLog = [
  { id: "1", type: "Organic", weight: "1.2 kg", date: "2025-09-08" },
  { id: "2", type: "Recyclable", weight: "0.8 kg", date: "2025-09-07" },
  { id: "3", type: "Hazardous", weight: "0.3 kg", date: "2025-09-07" },
];

const { width } = Dimensions.get("window");

interface CardProps {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
}

const InfoCard = ({ title, value, icon }: CardProps) => (
  <View style={styles.card}>
    <FontAwesome name={icon} size={24} color={Colors.light.primary} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

export default function DashboardScreen() {
  const router = useRouter();

  const [temperature] = useState("28°C");
  const [humidity] = useState("65%");
  const videoUrl = "";

  const cards: CardProps[] = [
    { title: "Temperature", value: temperature, icon: "thermometer-three-quarters" },
    { title: "Humidity", value: humidity, icon: "tint" },
    { title: "Recyclable", value: "1.8 kg", icon: "recycle" },
    { title: "Non-Recyclable", value: "0.5 kg", icon: "trash" },
    { title: "Hazardous", value: "0.3 kg", icon: "warning" },
  ];

  return (
    <ScrollView style={styles.container}>
      <StatusBar hidden />

      <View style={styles.menuBar}>
        <Text style={styles.title}>🌱 Eco Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/(user)/(tabs)/settings')}>
          <FontAwesome name="user-circle-o" size={28} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>

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
            <FontAwesome name="exclamation-triangle" size={30} color={Colors.light.danger} />
            <Text style={styles.errorText}>No video available</Text>
          </View>
        )}
      </View>

      <View style={styles.gridContainer}>
        {cards.map((item, index) => (
          <InfoCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </View>

      <WasteLogList data={wasteLog} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },

  menuBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", color: Colors.light.primary },

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
    backgroundColor: Colors.light.card,
    width: "95%",
    borderRadius: 12,
  },
  errorText: { marginTop: 8, color: Colors.light.danger, fontWeight: "600" },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  card: {
    width: width * 0.4,
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: Colors.light.text, marginTop: 8 },
  cardValue: { fontSize: 14, fontWeight: "500", color: Colors.light.text, marginTop: 6 },
});