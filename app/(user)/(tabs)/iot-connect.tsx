import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View as RNView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { View } from "../../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { Camera } from 'expo-camera';

export default function IoTConnectScreen() {
  const [brokerIP, setBrokerIP] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleConnect = () => {
    if (!brokerIP || !deviceName || !subscribeTopic || !publishTopic) {
      Alert.alert("⚠️ Missing Info", "Please fill in all fields");
      return;
    }
    Alert.alert("✅ Connected", "IoT Device Connected Successfully!");
  };

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setScannerVisible(false);
    try {
      const qrData = JSON.parse(data);
      if (qrData.brokerIP && qrData.deviceName && qrData.subscribeTopic && qrData.publishTopic) {
        setBrokerIP(qrData.brokerIP);
        setDeviceName(qrData.deviceName);
        setSubscribeTopic(qrData.subscribeTopic);
        setPublishTopic(qrData.publishTopic);
        Alert.alert("✅ Success", "Device details populated from QR code!");
      } else {
        Alert.alert("❌ Invalid QR Code", "The QR code does not contain the required IoT device details.");
      }
    } catch (error) {
      Alert.alert("❌ Invalid QR Code", "Failed to parse QR code data. Please ensure it's a valid JSON format.");
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting for camera permission</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#27ae60", "#1e8449"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <FontAwesome name="microchip" size={40} color="#fff" />
        <Text style={styles.headerTitle}>IoT Connect</Text>
      </LinearGradient>

      <Text style={styles.time}>{currentTime.toLocaleTimeString()}</Text>

      <RNView style={styles.card}>
        <Text style={styles.title}>Device Details</Text>
        <Text style={styles.subtitle}>Enter your IoT device details below or scan a QR code.</Text>

        <TouchableOpacity activeOpacity={0.8} style={styles.qrButton} onPress={() => { setScanned(false); setScannerVisible(true); }}>
          <FontAwesome name="qrcode" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>

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

      <Modal
        visible={isScannerVisible}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setScannerVisible(false)}
      >
        <View style={styles.scannerContainer}>
          <Camera
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setScannerVisible(false)}>
             <Text style={styles.closeButtonText}>Close Scanner</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.accent,
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  closeButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 15,
    borderRadius: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
});
