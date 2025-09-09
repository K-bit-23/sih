import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View as RNView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { View } from "../../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

export default function IoTConnectScreen() {
  const [brokerIP, setBrokerIP] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleConnect = () => {
    if (!brokerIP || !deviceName || !subscribeTopic || !publishTopic) {
      Alert.alert("⚠️ Missing Info", "Please fill in all fields");
      return;
    }
    Alert.alert("✅ Connected", "IoT Device Connected Successfully!");
  };

  return (
    <View style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={["#27ae60", "#1e8449"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome name="microchip" size={40} color="#fff" />
        <Text style={styles.headerTitle}>IoT Connect</Text>
      </LinearGradient>

      {/* Time */}
      <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>

      {/* Form Card */}
      <RNView style={styles.card}>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>Enter your IoT device details below.</Text>

        <TextInput
          style={styles.input}
          placeholder="🔗 Broker IP"
          placeholderTextColor="#999"
          value={brokerIP}
          onChangeText={setBrokerIP}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="📟 Device Name"
          placeholderTextColor="#999"
          value={deviceName}
          onChangeText={setDeviceName}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="📩 Subscribe Topic"
          placeholderTextColor="#999"
          value={subscribeTopic}
          onChangeText={setSubscribeTopic}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="📤 Publish Topic"
          placeholderTextColor="#999"
          value={publishTopic}
          onChangeText={setPublishTopic}
          textAlign="center"
        />

        <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>🚀 Connect Device</Text>
        </TouchableOpacity>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fff9",
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingVertical: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 6,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
  },
  time: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
    marginBottom: 16,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#f0f5f1",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dcdcdc",
    color: "#2c3e50",
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
