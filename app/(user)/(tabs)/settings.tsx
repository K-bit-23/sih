
import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert, Image, Modal, View as RNView } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { t, setLanguage, locale } = useLanguage();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isAccountMenuVisible, setAccountMenuVisible] = useState(false);
  const router = useRouter();

  const showLanguagePicker = () => {
    Alert.alert(
      t('languageSelection'),
      t('chooseLanguage'),
      [
        { text: t('english'), onPress: () => setLanguage('en') },
        { text: t('tamil'), onPress: () => setLanguage('ta') },
        { text: t('hindi'), onPress: () => setLanguage('hi') },
        { text: t('cancel'), style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const getLanguageName = (locale: string) => {
    if (locale.startsWith('en')) return t('english');
    if (locale.startsWith('ta')) return t('tamil');
    if (locale.startsWith('hi')) return t('hindi');
    return t('english');
  };

  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutMessage'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          onPress: () => router.replace('/sign-in'),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
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
      Alert.alert(t('error'), t('biometricNotSupported'));
      return;
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      Alert.alert(t('error'), t('biometricNotEnrolled'));
      return;
    }

    if (isBiometricEnabled) {
      setIsBiometricEnabled(false);
    } else {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: t('authenticate'),
      });

      if (success) {
        setIsBiometricEnabled(true);
      } else {
        Alert.alert(t('error'), t('authenticationFailed'));
      }
    }
  };

  const handleLocationToggle = () => {
    setIsLocationEnabled(previousState => !previousState);
    Alert.alert(
      isLocationEnabled ? t('disableLocation') : t('enableLocation'),
      isLocationEnabled ? t('locationDisabledMessage') : t('locationEnabledMessage')
    );
  };

  const handleAccountSettings = () => {
    setAccountMenuVisible(true);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('settings')}</Text>

      {/* Profile Picture Section */}
      <TouchableOpacity style={styles.profileContainer} onPress={pickImage}>
        <Image source={{ uri: profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
        <Text style={styles.profileText}>{t('changeProfilePicture')}</Text>
      </TouchableOpacity>

      {/* Account Section */}
      <TouchableOpacity style={styles.row} onPress={handleAccountSettings}>
        <MaterialCommunityIcons name="account-circle-outline" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('account')}</Text>
      </TouchableOpacity>

      {/* Account Settings Modal */}
      <Modal
        transparent={true}
        visible={isAccountMenuVisible}
        animationType="fade"
        onRequestClose={() => setAccountMenuVisible(false)} >
        <RNView style={styles.modalContainer}>
            <RNView style={styles.modalBox}>
                <TouchableOpacity style={styles.modalButton} onPress={() => {setAccountMenuVisible(false); Alert.alert("Edit Username", "Coming soon!")}}>
                    <Text style={styles.modalButtonText}>Edit Username</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => {setAccountMenuVisible(false); Alert.alert("Change Password", "Coming soon!")}}>
                    <Text style={styles.modalButtonText}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => {setAccountMenuVisible(false); Alert.alert("More", "Coming soon!")}}>
                    <Text style={styles.modalButtonText}>More</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, {backgroundColor: '#c0392b'}]} onPress={() => setAccountMenuVisible(false)}>
                    <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
            </RNView>
        </RNView>
      </Modal>

      {/* Language Selection */}
      <TouchableOpacity style={styles.row} onPress={showLanguagePicker}>
        <Ionicons name="language" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('language')}</Text>
        <Text style={styles.value}>{getLanguageName(locale)}</Text>
      </TouchableOpacity>

      {/* Dark Mode Toggle */}
      <View style={styles.row}>
        <FontAwesome name={colorScheme === 'dark' ? 'moon-o' : 'sun-o'} size={24} color="#27ae60" />
        <Text style={styles.label}>{t('darkMode')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={colorScheme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          value={colorScheme === 'dark'}
        />
      </View>

      {/* Enable Biometric Support */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="fingerprint" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('enableBiometric')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isBiometricEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={handleBiometricToggle}
          value={isBiometricEnabled}
        />
      </View>

      {/* Enable Location */}
      <View style={styles.row}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('enableLocation')}</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isLocationEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={handleLocationToggle}
          value={isLocationEnabled}
        />
      </View>

      {/* Tab Bar Customization */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert(t('customizeTabs'), t('customizeTabs') + ' coming soon!')}>
        <Ionicons name="options" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('customizeTabs')}</Text>
      </TouchableOpacity>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.row} onPress={handleLogout}>
        <MaterialCommunityIcons name="logout" size={24} color="#c0392b" />
        <Text style={[styles.label, { color: '#c0392b' }]}>{t('logout')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6fff9',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#27ae60',
  },
  profileText: {
    marginTop: 10,
    fontSize: 16,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
    flex: 1,
  },
  value: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 10,
  },
  modalButton: {
    backgroundColor: "#43a047",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center'
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
