import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { View, Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";

// i18n
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

// Enable animation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Language translations
const resources = {
  en: {
    translation: {
      preferences: "Preferences",
      account: "Account",
      more: "More",
      notifications: "Notifications",
      darkMode: "Dark Mode",
      editProfile: "Edit Profile",
      changePassword: "Change Password",
      logout: "Logout",
      language: "Language",
      help: "Help",
      privacy: "Privacy",
      appVersion: "App Version",
      location: "Location",
      pickProfile: "Pick Profile Picture",
      viewOnMap: "View on Map",
    },
  },
  ta: {
    translation: {
      preferences: "விருப்பங்கள்",
      account: "கணக்கு",
      more: "மேலும்",
      notifications: "அறிவிப்புகள்",
      darkMode: "இருண்ட நிலை",
      logout: "வெளியேறு",
      language: "மொழி",
      location: "இடம்",
    },
  },
  hi: {
    translation: {
      preferences: "प्राथमिकताएँ",
      account: "खाता",
      more: "अधिक",
      notifications: "सूचनाएं",
      darkMode: "डार्क मोड",
      logout: "लॉगआउट",
      language: "भाषा",
      location: "स्थान",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default function SettingsScreen() {
  const { t } = useTranslation();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenSection(openSection === section ? null : section);
  };

  useEffect(() => {
    const loadPreferences = async () => {
      const savedTheme = await AsyncStorage.getItem("theme");
      const savedLang = await AsyncStorage.getItem("language");
      const savedImage = await AsyncStorage.getItem("profileImage");
      const savedNotifications = await AsyncStorage.getItem("notifications");

      if (savedTheme) setDarkMode(savedTheme === "dark");
      if (savedLang) {
        setLanguage(savedLang);
        i18n.changeLanguage(savedLang);
      }
      if (savedImage) setProfileImage(savedImage);
      if (savedNotifications) setNotifications(savedNotifications === "true");
    };
    loadPreferences();
  }, []);

  // Pick Profile Picture
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "You need to allow access to your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem("profileImage", uri);
    }
  };

  // Dark Mode
  const toggleDarkMode = async () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    await AsyncStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Notifications
  const toggleNotifications = async () => {
    const newValue = !notifications;
    setNotifications(newValue);
    await AsyncStorage.setItem("notifications", newValue.toString());
  };

  // Language
  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  // Logout
  const handleLogout = () => {
    Alert.alert(t("logout"), "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: t("logout"),
        style: "destructive",
        onPress: () => router.replace("/sign-in"),
      },
    ]);
  };

  // Get Location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      };
      setLocation(coords);

      Alert.alert(
        "Location Found",
        `Latitude: ${coords.lat}, Longitude: ${coords.lng}`,
        [
          {
            text: t("viewOnMap"),
            onPress: () =>
              router.push(`/maps?lat=${coords.lat}&lng=${coords.lng}`),
          },
          { text: "OK" },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Unable to fetch location.");
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#121212" : "#fff" },
      ]}
    >
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={100} color="green" />
          )}
        </TouchableOpacity>
        <Text style={[styles.name, { color: darkMode ? "#fff" : "#000" }]}>
          Karthikeyan
        </Text>
        <Text style={[styles.email, { color: darkMode ? "#aaa" : "gray" }]}>
          karthikeyan@email.com
        </Text>
      </View>

      {/* Accordion Sections */}
      {["preferences", "account", "more"].map((section) => (
        <View
          key={section}
          style={[
            styles.card,
            { backgroundColor: darkMode ? "#1e1e1e" : "#f9f9f9" },
          ]}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(section)}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: darkMode ? "lightgreen" : "green" },
              ]}
            >
              {t(section)}
            </Text>
            <Ionicons
              name={openSection === section ? "chevron-up" : "chevron-down"}
              size={20}
              color={darkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>

          {openSection === section && (
            <View style={styles.accordionBody}>
              {section === "preferences" && (
                <>
                  <View style={styles.row}>
                    <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                      {t("notifications")}
                    </Text>
                    <Switch
                      value={notifications}
                      onValueChange={toggleNotifications}
                      trackColor={{ false: "#ccc", true: "lightgreen" }}
                      thumbColor={notifications ? "green" : "#f4f3f4"}
                    />
                  </View>
                  <View style={styles.row}>
                    <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                      {t("darkMode")}
                    </Text>
                    <Switch
                      value={darkMode}
                      onValueChange={toggleDarkMode}
                      trackColor={{ false: "#ccc", true: "lightgreen" }}
                      thumbColor={darkMode ? "green" : "#f4f3f4"}
                    />
                  </View>
                  <TouchableOpacity style={styles.row} onPress={getLocation}>
                    <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                      {t("location")}
                    </Text>
                    <Ionicons name="location" size={20} color="green" />
                  </TouchableOpacity>
                </>
              )}

              {section === "account" && (
                <>
                  <TouchableOpacity style={styles.row} onPress={pickImage}>
                    <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                      {t("pickProfile")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => router.push("/change-password")}
                  >
                    <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                      {t("changePassword")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.row} onPress={handleLogout}>
                    <Text style={{ color: "red", fontWeight: "600" }}>
                      {t("logout")}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {section === "more" && (
                <View style={styles.row}>
                  <Text style={{ color: darkMode ? "#fff" : "#000" }}>
                    {t("language")}
                  </Text>
                  <View style={styles.languageRow}>
                    {["en", "ta", "hi"].map((lang) => (
                      <TouchableOpacity
                        key={lang}
                        onPress={() => changeLanguage(lang)}
                      >
                        <Text
                          style={{
                            color:
                              language === lang
                                ? "green"
                                : darkMode
                                ? "#fff"
                                : "#000",
                            fontWeight: language === lang ? "bold" : "normal",
                            marginHorizontal: 6,
                          }}
                        >
                          {lang === "en"
                            ? "English"
                            : lang === "ta"
                            ? "தமிழ்"
                            : "हिन्दी"}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  profileSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "green",
  },
  name: { fontSize: 20, fontWeight: "bold" },
  email: { fontSize: 14 },
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 6 },
  accordionBody: { marginTop: 8, paddingLeft: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  languageRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
});
