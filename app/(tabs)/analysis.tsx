import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome5 } from "@expo/vector-icons";

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera permission is needed to take a photo.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      handleImage(result.assets[0].uri);
    }
  };

  const handleImage = (uri: string) => {
    setLoading(true);
    setImage(uri);
    setPrediction(null);

    // Simulate ML processing
    setTimeout(() => {
      predictObject();
      setLoading(false);
    }, 1500);
  };

  const predictObject = () => {
    const options = ["Recyclable", "Non-Recyclable"];
    const randomPrediction = options[Math.floor(Math.random() * options.length)];
    setPrediction(randomPrediction);
  };

  const reset = () => {
    setImage(null);
    setPrediction(null);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>♻ Waste Object Classifier</Text>
      <Text style={styles.subtitle}>Take a photo or upload from gallery</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.iconButton} onPress={takePhoto}>
          <FontAwesome5 name="camera" size={28} color="#fff" />
          <Text style={styles.iconText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <FontAwesome5 name="upload" size={28} color="#fff" />
          <Text style={styles.iconText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#27ae60" style={{ marginVertical: 20 }} />}

      {image && !loading && <Image source={{ uri: image }} style={styles.photo} />}

      {prediction && !loading && (
        <Text
          style={[
            styles.prediction,
            { color: prediction === "Recyclable" ? "green" : "red" },
          ]}
        >
          {prediction}
        </Text>
      )}

      {(image || prediction) && !loading && (
        <TouchableOpacity style={styles.resetButton} onPress={reset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0fff4",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 16,
  },
  iconButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  prediction: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  resetButton: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
  },
  resetText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
