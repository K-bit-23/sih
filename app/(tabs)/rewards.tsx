import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { View, Text } from "@/components/Themed";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";


export default function RewardsScreen() {
  const [upiId, setUpiId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Take photo from camera
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!upiId && !mobileNumber) {
      alert("Please enter UPI ID or Mobile Number");
      return;
    }
    if (!image) {
      alert("Please upload/take a screenshot");
      return;
    }
    alert(`Form submitted!\nUPI: ${upiId}\nMobile: ${mobileNumber}\nImage attached ✅`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎁 Rewards</Text>
      <Text style={styles.pointsText}>You have earned 120 points!</Text>
      <Text style={styles.subText}>
        Redeem your points by submitting your details below.
      </Text>

      {/* Input Fields */}
      <TextInput
        style={styles.input}
        placeholder="Enter UPI ID"
        placeholderTextColor="#888"
        value={upiId}
        onChangeText={setUpiId}
      />
      <Text style={styles.orText}>OR</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        value={mobileNumber}
        onChangeText={setMobileNumber}
      />

      {/* Image Upload Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <FontAwesome name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <FontAwesome name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Preview Selected Image */}
      {image && (
        <View style={styles.previewBox}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <Text style={styles.previewText}>Screenshot attached</Text>
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f6fff9",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 10, color: "#27ae60" },
  pointsText: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
  subText: { fontSize: 14, color: "#555", marginBottom: 20, textAlign: "center" },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#27ae60",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  orText: {
    marginVertical: 8,
    fontWeight: "bold",
    color: "#555",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#27ae60",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
  previewBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#27ae60",
  },
  previewText: {
    color: "#27ae60",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    marginTop: 10,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
//BOTTOM NAVBAR  FOR SETTINGS PAGE,DASHBOARD PAGE,REWARDS PAGE,MAPS PAGE,IoT CONNECT PAGE