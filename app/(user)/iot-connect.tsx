import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  TextInput,
  Alert,
} from 'react-native';
import { View } from '../../components/Themed';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useLanguage } from '../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function IoTConnectScreen() {
  const [deviceId, setDeviceId] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const { t } = useLanguage();

  const handleConnect = () => {
    if (!deviceId || !wifiSsid || !wifiPassword) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }
    setIsConnecting(true);
    console.log(`Connecting device ${deviceId} to ${wifiSsid}`);

    // Simulate a connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnected(true);
      Alert.alert(
        t('deviceConnected'),
        t('successfullyConnectedToDevice').replace('{{device}}', deviceId)
      );
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
      >
        <Text style={styles.headerText}>{t('connectToYourDevice')}</Text>
        <Text style={styles.subHeaderText}>{t('enterDeviceDetails')}</Text>
      </LinearGradient>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="robot" size={20} color={Colors.light.primary} />
          <TextInput
            style={styles.input}
            placeholder={t('deviceId')}
            value={deviceId}
            onChangeText={setDeviceId}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="wifi" size={20} color={Colors.light.primary} />
          <TextInput
            style={styles.input}
            placeholder={t('wifiSsid')}
            value={wifiSsid}
            onChangeText={setWifiSsid}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome5 name="lock" size={20} color={Colors.light.primary} />
          <TextInput
            style={styles.input}
            placeholder={t('wifiPassword')}
            value={wifiPassword}
            onChangeText={setWifiPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
          <Text style={styles.connectButtonText}>{t('connect')}</Text>
        </TouchableOpacity>
      </View>

      {isConnecting && (
        <View style={styles.overlay}>
          <MaterialCommunityIcons name="lan-connect" size={60} color="white" />
          <Text style={styles.overlayText}>{t('connecting')}</Text>
        </View>
      )}

      {connected && (
        <View style={[styles.overlay, styles.successOverlay]}>
          <FontAwesome5 name="check-circle" size={60} color="white" />
          <Text style={styles.overlayText}>{t('deviceConnected')}</Text>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={() => {
              setConnected(false);
              setDeviceId('');
              setWifiSsid('');
              setWifiPassword('');
            }}
          >
            <Text style={styles.tryAgainButtonText}>{t('connectAnotherDevice')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  subHeaderText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 16,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    marginTop: 15,
  },
  successOverlay: {
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
  },
  tryAgainButton: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  tryAgainButtonText: {
    color: Colors.light.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});