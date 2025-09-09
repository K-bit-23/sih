import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Alert,
  View as RNView,
  TouchableOpacity,
  Modal,
  Button,
  Image,
} from "react-native";
import { View } from "../../../components/Themed";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function IoTConnectScreen() {
  const [brokerIP, setBrokerIP] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [subscribeTopic, setSubscribeTopic] = useState("");
  const [publishTopic, setPublishTopic] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const [scanned, setScanned] = useState(false);
  const [isScannerVisible, setScannerVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [tempQrData, setTempQrData] = useState<any>(null);

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

  const processQrData = (data: string) => {
    try {
      const qrData = JSON.parse(data);
      if (qrData.brokerIP && qrData.deviceName && qrData.subscribeTopic && qrData.publishTopic) {
        setTempQrData(qrData);
        setModalContent({
          title: "IoT Device Details",
          message: `Broker IP: ${qrData.brokerIP}\nDevice Name: ${qrData.deviceName}\nSubscribe Topic: ${qrData.subscribeTopic}\nPublish Topic: ${qrData.publishTopic}`
        });
      } else {
        setTempQrData(null);
        setModalContent({
          title: "QR Code Content",
          message: JSON.stringify(qrData, null, 2)
        });
      }
    } catch (error) {
      setTempQrData(null);
      setModalContent({
        title: "QR Code Content",
        message: data
      });
    }
    setModalVisible(true);
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setScannerVisible(false);
    processQrData(data);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setImage(uri);
        try {
            const [barCode] = await BarCodeScanner.scanFromURLAsync(uri);
            if (barCode && barCode.data) {
                processQrData(barCode.data);
            } else {
                setModalContent({
                    title: "❌ No QR Code Found",
                    message: "Could not find a QR code in the selected image."
                });
                setModalVisible(true);
            }
        } catch (error) {
            setModalContent({
                title: "❌ Error",
                message: "An error occurred while reading the QR code."
            });
            setModalVisible(true);
        }
    }
  };

  const handleModalConfirm = () => {
    if (tempQrData) {
      setBrokerIP(tempQrData.brokerIP);
      setDeviceName(tempQrData.deviceName);
      setSubscribeTopic(tempQrData.subscribeTopic);
      setPublishTopic(tempQrData.publishTopic);
    }
    setModalVisible(false);
    setTempQrData(null);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setTempQrData(null);
  }

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
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
        <Text style={styles.subtitle}>Enter your IoT device details below or use a QR code.</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity activeOpacity={0.8} style={styles.qrButton} onPress={() => { setScanned(false); setScannerVisible(true); }}>
            <FontAwesome name="qrcode" size={24} color="#fff" />
            <Text style={styles.buttonText}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={styles.uploadButton} onPress={pickImage}>
            <FontAwesome name="upload" size={24} color="#fff" />
            <Text style={styles.buttonText}>Upload QR</Text>
          </TouchableOpacity>
        </View>

        {image && (
            <View style={styles.previewBox}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <Text style={styles.previewText}>Image selected</Text>
            </View>
        )}

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
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setScannerVisible(false)}>
             <Text style={styles.closeButtonText}>Close Scanner</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <RNView style={styles.modalContainer}>
          <RNView style={styles.modalBox}>
            <Text style={styles.modalTitle}>{modalContent.title}</Text>
            <Text style={styles.modalMessage}>{modalContent.message}</Text>
            <View style={styles.modalButtonContainer}>
              {tempQrData &&
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleModalCancel}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              }
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalConfirm}>
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6fff9",
    alignItems: "center",
    justifyContent: 'center',
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
    position: 'absolute',
    top: 0,
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
    marginTop: 150, // Adjust this to leave space for the header
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.accent,
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 10,
    flex: 1,
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
  previewBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  previewText: {
    color: Colors.light.primary,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});