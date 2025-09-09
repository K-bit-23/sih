import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  ScrollView,
  Switch,
  Alert,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { View } from '../../../components/Themed';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useLanguage } from '../../context/LanguageContext';
import { useColorScheme } from 'react-native';
import { Link, useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export default function SettingsScreen() {
  const { t, locale, setLanguage } = useLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];
  const router = useRouter();

  // State management
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  
  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    avatar: null,
  });

  // Form states
  const [editProfile, setEditProfile] = useState<UserProfile>(userProfile);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadSettings();
    loadUserProfile();
  }, []);

  const loadSettings = async () => {
    try {
      const locationStatus = await AsyncStorage.getItem('locationEnabled');
      const notificationStatus = await AsyncStorage.getItem('notificationsEnabled');
      const biometricStatus = await AsyncStorage.getItem('biometricEnabled');
      
      if (locationStatus !== null) setLocationEnabled(JSON.parse(locationStatus));
      if (notificationStatus !== null) setNotificationsEnabled(JSON.parse(notificationStatus));
      if (biometricStatus !== null) setBiometricEnabled(JSON.parse(biometricStatus));
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await AsyncStorage.getItem('userProfile');
      if (profile) {
        const parsedProfile = JSON.parse(profile);
        setUserProfile(parsedProfile);
        setEditProfile(parsedProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(profile));
      setUserProfile(profile);
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const toggleLocation = async () => {
    if (!locationEnabled) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Location permission is required to enable this feature.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    const newStatus = !locationEnabled;
    setLocationEnabled(newStatus);
    await AsyncStorage.setItem('locationEnabled', JSON.stringify(newStatus));
    
    Alert.alert(
      'Location Services',
      newStatus ? 'Location services enabled successfully!' : 'Location services disabled.',
      [{ text: 'OK' }]
    );
  };

  const toggleNotifications = async () => {
    const newStatus = !notificationsEnabled;
    setNotificationsEnabled(newStatus);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newStatus));
  };

  const toggleBiometric = async () => {
    const newStatus = !biometricEnabled;
    setBiometricEnabled(newStatus);
    await AsyncStorage.setItem('biometricEnabled', JSON.stringify(newStatus));
    
    Alert.alert(
      'Biometric Authentication',
      newStatus ? 'Biometric authentication enabled!' : 'Biometric authentication disabled.',
      [{ text: 'OK' }]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditProfile({ ...editProfile, avatar: result.assets[0].uri });
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditProfile({ ...editProfile, avatar: result.assets[0].uri });
    }
  };

  const handleSaveProfile = () => {
    if (!editProfile.name.trim() || !editProfile.email.trim()) {
      Alert.alert('Error', 'Name and email are required fields.');
      return;
    }

    saveUserProfile(editProfile);
    setProfileModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      Alert.alert('Error', 'All password fields are required.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    // In a real app, you would validate the current password and update it
    setPasswordModalVisible(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    Alert.alert('Success', 'Password changed successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            router.replace('/sign-in');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={() => setProfileModalVisible(true)}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.secondary }]}>
                <FontAwesome5 name="user" size={30} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('account')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setProfileModalVisible(true)}>
          <FontAwesome5 name="user-edit" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Profile</Text>
          <FontAwesome5 name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setPasswordModalVisible(true)}>
          <FontAwesome5 name="lock" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Change Password</Text>
          <FontAwesome5 name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Privacy & Security */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>Privacy & Security</Text>
        
        <View style={styles.menuItem}>
          <Ionicons name="location" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Location Services</Text>
          <Switch
            value={locationEnabled}
            onValueChange={toggleLocation}
            trackColor={{ false: '#767577', true: colors.accent }}
            thumbColor={locationEnabled ? colors.primary : '#f4f3f4'}
          />
        </View>

        <View style={styles.menuItem}>
          <FontAwesome5 name="fingerprint" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Biometric Login</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={toggleBiometric}
            trackColor={{ false: '#767577', true: colors.accent }}
            thumbColor={biometricEnabled ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Notifications */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>Notifications</Text>
        
        <View style={styles.menuItem}>
          <Ionicons name="notifications" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Push Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: '#767577', true: colors.accent }}
            thumbColor={notificationsEnabled ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('language')}</Text>
        
        <TouchableOpacity style={styles.menuItem} onPress={() => setLanguageModalVisible(true)}>
          <MaterialIcons name="language" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            {locale === 'en' ? 'English' : locale === 'hi' ? 'हिंदी' : 'தமிழ்'}
          </Text>
          <FontAwesome5 name="chevron-right" size={16} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Device Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>Device</Text>
        
        <Link href="/(user)/(tabs)/iot-connect" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <FontAwesome5 name="robot" size={20} color={colors.text} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Connect IoT Device</Text>
            <FontAwesome5 name="chevron-right" size={16} color={colors.text} />
          </TouchableOpacity>
        </Link>
      </View>

      {/* Logout */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.danger }]} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Edit Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.primary }]}>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
              <FontAwesome5 name="times" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.avatarSection}>
              <TouchableOpacity onPress={pickImage}>
                {editProfile.avatar ? (
                  <Image source={{ uri: editProfile.avatar }} style={styles.editAvatar} />
                ) : (
                  <View style={[styles.editAvatarPlaceholder, { backgroundColor: colors.secondary }]}>
                    <FontAwesome5 name="user" size={40} color="white" />
                  </View>
                )}
              </TouchableOpacity>
              <View style={styles.avatarButtons}>
                <TouchableOpacity style={[styles.avatarButton, { backgroundColor: colors.primary }]} onPress={pickImage}>
                  <FontAwesome5 name="image" size={16} color="white" />
                  <Text style={styles.avatarButtonText}>Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.avatarButton, { backgroundColor: colors.accent }]} onPress={takePhoto}>
                  <FontAwesome5 name="camera" size={16} color="white" />
                  <Text style={styles.avatarButtonText}>Camera</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={editProfile.name}
                onChangeText={(text) => setEditProfile({ ...editProfile, name: text })}
                placeholder="Enter your name"
                placeholderTextColor={colors.text + '80'}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Email</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={editProfile.email}
                onChangeText={(text) => setEditProfile({ ...editProfile, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={colors.text + '80'}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={editProfile.phone}
                onChangeText={(text) => setEditProfile({ ...editProfile, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.text + '80'}
                keyboardType="phone-pad"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Password Change Modal */}
      <Modal
        visible={passwordModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.primary }]}>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
              <FontAwesome5 name="times" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TouchableOpacity onPress={handleChangePassword}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Current Password</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={passwordForm.currentPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, currentPassword: text })}
                placeholder="Enter current password"
                placeholderTextColor={colors.text + '80'}
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={passwordForm.newPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, newPassword: text })}
                placeholder="Enter new password"
                placeholderTextColor={colors.text + '80'}
                secureTextEntry
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, { borderColor: colors.primary, color: colors.text }]}
                value={passwordForm.confirmPassword}
                onChangeText={(text) => setPasswordForm({ ...passwordForm, confirmPassword: text })}
                placeholder="Confirm new password"
                placeholderTextColor={colors.text + '80'}
                secureTextEntry
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Language Selection Modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.languageModalOverlay}>
          <View style={[styles.languageModal, { backgroundColor: colors.card }]}>
            <Text style={[styles.languageModalTitle, { color: colors.primary }]}>Select Language</Text>
            
            <TouchableOpacity
              style={[styles.languageOption, locale === 'en' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => {
                setLanguage('en');
                setLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>English</Text>
              {locale === 'en' && <FontAwesome5 name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, locale === 'hi' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => {
                setLanguage('hi');
                setLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>हिंदी (Hindi)</Text>
              {locale === 'hi' && <FontAwesome5 name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.languageOption, locale === 'ta' && { backgroundColor: colors.primary + '20' }]}
              onPress={() => {
                setLanguage('ta');
                setLanguageModalVisible(false);
              }}
            >
              <Text style={[styles.languageText, { color: colors.text }]}>தமிழ் (Tamil)</Text>
              {locale === 'ta' && <FontAwesome5 name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.danger }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  profileSection: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    borderRadius: 15,
    margin: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  avatarSection: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 30,
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  editAvatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarButtons: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    gap: 10,
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 5,
  },
  avatarButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  formGroup: {
    backgroundColor: 'transparent',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  languageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  languageModal: {
    width: '80%',
    borderRadius: 15,
    padding: 20,
  },
  languageModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});