import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View as RNView,
  TouchableOpacity,
} from "react-native";
import { View } from "../../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Colors from "../../../constants/Colors";

export default function IoTConnectScreen() {
  const router = useRouter(); 
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
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", "IoT Device Connected Successfully!");
  };

  return (
    <View style={styles.container}>
      <RNView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={26} color={Colors.light.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>IoT Connect</Text>
      </RNView>

      <FontAwesome name="wifi" size={50} color={Colors.light.primary} style={{ marginBottom: 12 }} />

      <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>

      <Text style={styles.title}>IoT Device Details</Text>
      <Text style={styles.subtitle}>Enter your device details below.</Text>

      <RNView style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Broker IP"
          placeholderTextColor={Colors.light.tabIconDefault}
          value={brokerIP}
          onChangeText={setBrokerIP}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="Device Name"
          placeholderTextColor={Colors.light.tabIconDefault}
          value={deviceName}
          onChangeText={setDeviceName}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="Subscribe Topic"
          placeholderTextColor={Colors.light.tabIconDefault}
          value={subscribeTopic}
          onChangeText={setSubscribeTopic}
          textAlign="center"
        />
        <TextInput
          style={styles.input}
          placeholder="Publish Topic"
          placeholderTextColor={Colors.light.tabIconDefault}
          value={publishTopic}
          onChangeText={setPublishTopic}
          textAlign="center"
        />

        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>Connect Device</Text>
        </TouchableOpacity>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: "center",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.light.text,
  },
  time: {
    fontSize: 14, 
    fontWeight: "400", 
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.light.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "90%",
    backgroundColor: Colors.light.card,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    color: Colors.light.text,
  },
  button: {
    width: "90%",
    backgroundColor: Colors.light.primary,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});