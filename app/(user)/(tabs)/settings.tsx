import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  View as RNView,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { View, Text } from "../../../components/Themed";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as LocalAuthentication from "expo-local-authentication";

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { t, setLanguage, locale } = useLanguage();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAccountMenuVisible, setAccountMenuVisible] = useState(false);
  const [isTabModalVisible, setTabModalVisible] = useState(false);

  const router = useRouter();

  const [tabs, setTabs] = useState([
    { key: "dashboard", label: t("dashboard"), visible: true },
    { key: "waste", label: t("waste"), visible: true },
    { key: "connect", label: t("connect"), visible: true },
    { key: "analytics", label: t("analytics"), visible: true },
  ]);

  // Reset all settings to default
  const handleReset = () => {
    setColorScheme("light");
    setIsBiometricEnabled(false);
    setIsLocationEnabled(false);
    setProfileImage(null);
    setLanguage("en");
    setTabs([
      { key: "dashboard", label: t("dashboard"), visible: true },
      { key: "waste", label: t("waste"), visible: true },
      { key: "connect", label: t("connect"), visible: true },
      { key: "analytics", label: t("analytics"), visible: true },
    ]);
    Alert.alert("Reset", "All settings have been reset to default.");
  };

  const showLanguagePicker = () => {
    Alert.alert(
      t("languageSelection"),
      t("chooseLanguage"),
      [
        { text: t("english"), onPress: () => setLanguage("en") },
        { text: t("tamil"), onPress: () => setLanguage("ta") },
        { text: t("hindi"), onPress: () => setLanguage("hi") },
        { text: t("cancel"), style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const getLanguageName = (locale: string) => {
    if (locale.startsWith("en")) return t("english");
    if (locale.startsWith("ta")) return t("tamil");
    if (locale.startsWith("hi")) return t("hindi");
    return t("english");
  };

  const handleLogout = () => {
    Alert.alert(t("logout"), t("logoutMessage"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("logout"),
        onPress: () => router.replace("/sign-in"),
        style: "destructive",
      },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleBiometricToggle = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      Alert.alert(t("error"), t("biometricNotSupported"));
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(t("error"), t("biometricNotEnrolled"));
      return;
    }

    if (isBiometricEnabled) {
      setIsBiometricEnabled(false);
    } else {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: t("authenticate"),
      });
      if (success) {
        setIsBiometricEnabled(true);
      } else {
        Alert.alert(t("error"), t("authenticationFailed"));
      }
    }
  };

  const handleLocationToggle = () => {
    setIsLocationEnabled((prev) => !prev);
    Alert.alert(
      isLocationEnabled ? t("disableLocation") : t("enableLocation"),
      isLocationEnabled
        ? t("locationDisabledMessage")
        : t("locationEnabledMessage")
    );
  };

  // Render tabs inside draggable list
  const renderTabItem = ({ item, drag, isActive }: RenderItemParams<any>) => (
    <TouchableOpacity
      style={[
        styles.tabItem,
        { backgroundColor: isActive ? "#dfe6e9" : "#fff" },
      ]}
      onLongPress={drag}
    >
      <Text style={styles.tabLabel}>{item.label}</Text>
      <Switch
        value={item.visible}
        onValueChange={(val) =>
          setTabs((prev) =>
            prev.map((t) =>
              t.key === item.key ? { ...t, visible: val } : t
            )
          )
        }
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("settings")}</Text>

      {/* Profile Picture */}
      <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
        <Image
          source={{ uri: profileImage || "https://via.placeholder.com/150" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileText}>{t("changeProfilePicture")}</Text>
      </TouchableOpacity>

      {/* Language */}
      <TouchableOpacity style={styles.row} onPress={showLanguagePicker}>
        <Ionicons name="language" size={24} color="#27ae60" />
        <Text style={styles.label}>{t("language")}</Text>
        <Text style={styles.value}>{getLanguageName(locale)}</Text>
      </TouchableOpacity>

      {/* Dark Mode */}
      <View style={styles.row}>
        <FontAwesome
          name={colorScheme === "dark" ? "moon-o" : "sun-o"}
          size={24}
          color="#27ae60"
        />
        <Text style={styles.label}>{t("darkMode")}</Text>
        <Switch
          value={colorScheme === "dark"}
          onValueChange={() =>
            setColorScheme(colorScheme === "dark" ? "light" : "dark")
          }
        />
      </View>

      {/* Biometric */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="fingerprint" size={24} color="#27ae60" />
        <Text style={styles.label}>{t("enableBiometric")}</Text>
        <Switch
          value={isBiometricEnabled}
          onValueChange={handleBiometricToggle}
        />
      </View>

      {/* Location */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#27ae60" />
        <Text style={styles.label}>{t("enableLocation")}</Text>
        <Switch value={isLocationEnabled} onValueChange={handleLocationToggle} />
      </View>

      {/* Customize Tabs */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setTabModalVisible(true)}
      >
        <Ionicons name="options" size={24} color="#27ae60" />
        <Text style={styles.label}>{t("customizeTabs")}</Text>
      </TouchableOpacity>

      {/* Reset */}
      <TouchableOpacity
        style={[styles.row, { backgroundColor: "#f1c40f20" }]}
        onPress={handleReset}
      >
        <MaterialCommunityIcons name="refresh" size={24} color="#f39c12" />
        <Text style={[styles.label, { color: "#f39c12" }]}>Reset</Text>
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity style={styles.row} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={24} color="#c0392b" />
        <Text style={[styles.label, { color: "#c0392b" }]}>{t("logout")}</Text>
      </TouchableOpacity>

      {/* Tabs Modal */}
      <Modal visible={isTabModalVisible} animationType="slide" transparent>
        <RNView style={styles.modalContainer}>
          <RNView style={styles.modalBox}>
            <Text style={styles.modalHeader}>Customize Tabs</Text>
            <DraggableFlatList
              data={tabs}
              keyExtractor={(item) => item.key}
              renderItem={renderTabItem}
              onDragEnd={({ data }) => setTabs(data)}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#27ae60" }]}
              onPress={() => setTabModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f6fff9" },
  header: { fontSize: 28, fontWeight: "bold", color: "#27ae60", marginBottom: 20 },
  profileContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: {
    width: 150, height: 150, borderRadius: 75, borderWidth: 3, borderColor: "#27ae60",
  },
  profileText: { marginTop: 10, fontSize: 16, color: "#27ae60", fontWeight: "bold" },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#ecf0f1",
  },
  label: { fontSize: 18, marginLeft: 15, color: "#333", flex: 1 },
  value: { fontSize: 16, color: "#7f8c8d" },
  modalContainer: {
    flex: 1, backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center", alignItems: "center",
  },
  modalBox: {
    width: "90%", maxHeight: "80%", backgroundColor: "#fff",
    padding: 20, borderRadius: 16, elevation: 10,
  },
  modalHeader: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  modalButton: {
    marginTop: 15, padding: 12, borderRadius: 8,
    alignItems: "center",
  },
  modalButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  tabItem: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between",
    padding: 12, marginBottom: 8,
    borderRadius: 8, borderWidth: 1, borderColor: "#dcdde1",
  },
  tabLabel: { fontSize: 16, color: "#2c3e50" },
});
