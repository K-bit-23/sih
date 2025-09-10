import { useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  View as RNView,
  FlatList,
} from "react-native";
import { View, Text } from "@/components/Themed";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const leaderboardData = [
  { id: "1", rank: 1, user: "GreenWarrior", points: 2500 },
  { id: "2", rank: 2, user: "EcoSavvy", points: 2350 },
  { id: "3", rank: 3, user: "RecycleKing", points: 2100 },
  { id: "4", rank: 4, user: "WasteWatcher", points: 1980 },
  { id: "5", rank: 5, user: "PlanetProtector", points: 1820 },
  { id: "6", rank: 6, user: "SortMaster", points: 1700 },
  { id: "7", rank: 7, user: "EcoChamp", points: 1550 },
  { id: "8", rank: 8, user: "TerraGuard", points: 1400 },
  { id: "9", rank: 9, user: "EnviroHero", points: 1250 },
  { id: "10", rank: 10, user: "NatureLover", points: 1100 },
];

export default function RewardsScreen() {
  const [upiId, setUpiId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

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
      Alert.alert("Missing Information", "Please enter a UPI ID or Mobile Number.");
      return;
    }
    if (!image) {
      Alert.alert("Missing Screenshot", "Please upload or take a screenshot of the QR code.");
      return;
    }
    Alert.alert(
      "Submission Successful!",
      `Your request has been submitted with the following details:\nUPI/Mobile: ${upiId || mobileNumber}\nImage attached ✅`
    );
  };

  const renderLeaderboardItem = ({ item }: { item: typeof leaderboardData[0] }) => (
    <RNView style={styles.leaderboardRow}>
      <Text style={[styles.leaderboardText, styles.rank]}>{item.rank}</Text>
      <Text style={[styles.leaderboardText, styles.user]}>{item.user}</Text>
      <Text style={[styles.leaderboardText, styles.points]}>{item.points}</Text>
    </RNView>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏆 Leaderboard</Text>
      <View style={styles.leaderboardContainer}>
        <View style={styles.leaderboardHeader}>
          <Text style={[styles.headerText, styles.rank]}>Rank</Text>
          <Text style={[styles.headerText, styles.user]}>User</Text>
          <Text style={[styles.headerText, styles.points]}>Points</Text>
        </View>
        <FlatList
          data={leaderboardData.slice(0, 10)}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.id}
        />
      </View>

      <Text style={styles.title}>🎁 Claim Your Rewards</Text>
      <Text style={styles.subText}>
        Redeem your points by submitting your payment details below.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter UPI ID or Mobile Number"
        placeholderTextColor="#888"
        value={upiId || mobileNumber}
        onChangeText={(text) => {
          if (isNaN(Number(text))) {
            setUpiId(text);
            setMobileNumber("");
          } else {
            setMobileNumber(text);
            setUpiId("");
          }
        }}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <FontAwesome name="image" size={20} color="#fff" />
          <Text style={styles.buttonText}>Upload Screenshot</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <FontAwesome name="camera" size={20} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {image && (
        <View style={styles.previewBox}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <Text style={styles.previewText}>QR code attached</Text>
        </View>
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Claim Reward</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginVertical: 20,
    color: Colors.light.primary,
  },
  subText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 20,
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: Colors.light.primary,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.primary,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leaderboardText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  rank: { flex: 1, textAlign: 'center' },
  user: { flex: 3 },
  points: { flex: 2, textAlign: 'right' },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
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
    marginBottom: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  previewText: {
    color: Colors.light.primary,
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: Colors.light.accent,
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});