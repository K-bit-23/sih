import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { View } from '../../components/Themed';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useLanguage } from '../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface IoTDevice {
  id: string;
  deviceId: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'connecting';
  lastSeen: Date;
  wifiSsid: string;
  batteryLevel?: number;
  sensorData?: {
    temperature?: number;
    humidity?: number;
    fillLevel?: number;
  };
}

export default function IoTConnectScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [deviceId, setDeviceId] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('smart-bin');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<IoTDevice[]>([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConnectedDevices();
  }, []);

  const loadConnectedDevices = async () => {
    try {
      setLoading(true);
      const devicesRef = collection(db, 'iot_devices');
      const q = query(devicesRef, orderBy('lastSeen', 'desc'));
      
      // Real-time listener for device updates
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const devices: IoTDevice[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          devices.push({
            id: doc.id,
            deviceId: data.deviceId,
            name: data.name,
            type: data.type,
            status: data.status,
            lastSeen: data.lastSeen?.toDate() || new Date(),
            wifiSsid: data.wifiSsid,
            batteryLevel: data.batteryLevel,
            sensorData: data.sensorData,
          });
        });
        setConnectedDevices(devices);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading devices:', error);
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!deviceId || !deviceName || !wifiSsid || !wifiPassword) {
      Alert.alert(t('error'), 'Please fill in all fields');
      return;
    }

    setIsConnecting(true);

    try {
      // Simulate device connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add device to Firebase
      const deviceData = {
        deviceId,
        name: deviceName,
        type: deviceType,
        status: 'online',
        lastSeen: new Date(),
        wifiSsid,
        batteryLevel: Math.floor(Math.random() * 100) + 1,
        sensorData: {
          temperature: Math.floor(Math.random() * 30) + 15,
          humidity: Math.floor(Math.random() * 60) + 30,
          fillLevel: Math.floor(Math.random() * 100),
        },
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'iot_devices'), deviceData);

      setIsConnecting(false);
      setConnected(true);
      setShowAddDevice(false);
      
      // Reset form
      setDeviceId('');
      setDeviceName('');
      setWifiSsid('');
      setWifiPassword('');

      Alert.alert(
        'Device Connected!',
        `Successfully connected ${deviceName} to your network.`
      );
    } catch (error) {
      console.error('Error connecting device:', error);
      setIsConnecting(false);
      Alert.alert('Connection Failed', 'Failed to connect device. Please try again.');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart-bin': return 'trash-alt';
      case 'sensor': return 'thermometer-half';
      case 'camera': return 'camera';
      default: return 'microchip';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#4CAF50';
      case 'offline': return '#F44336';
      case 'connecting': return '#FF9800';
      default: return Colors.light.text;
    }
  };

  const renderDeviceCard = (device: IoTDevice) => (
    <View key={device.id} style={styles.deviceCard}>
      <View style={styles.deviceHeader}>
        <View style={styles.deviceInfo}>
          <View style={[styles.deviceIconContainer, { backgroundColor: getStatusColor(device.status) + '20' }]}>
            <FontAwesome5 
              name={getDeviceIcon(device.type) as any} 
              size={20} 
              color={getStatusColor(device.status)} 
            />
          </View>
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceId}>ID: {device.deviceId}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(device.status) }]}>
          <Text style={styles.statusText}>{device.status}</Text>
        </View>
      </View>

      <View style={styles.deviceStats}>
        {device.batteryLevel && (
          <View style={styles.statItem}>
            <FontAwesome5 name="battery-three-quarters" size={14} color={Colors.light.text} />
            <Text style={styles.statText}>{device.batteryLevel}%</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <FontAwesome5 name="wifi" size={14} color={Colors.light.text} />
          <Text style={styles.statText}>{device.wifiSsid}</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="clock" size={14} color={Colors.light.text} />
          <Text style={styles.statText}>
            {device.lastSeen.toLocaleDateString()}
          </Text>
        </View>
      </View>

      {device.sensorData && (
        <View style={styles.sensorData}>
          <Text style={styles.sensorTitle}>Sensor Data</Text>
          <View style={styles.sensorGrid}>
            {device.sensorData.temperature && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="thermometer-half" size={16} color={Colors.light.primary} />
                <Text style={styles.sensorValue}>{device.sensorData.temperature}°C</Text>
              </View>
            )}
            {device.sensorData.humidity && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="tint" size={16} color={Colors.light.accent} />
                <Text style={styles.sensorValue}>{device.sensorData.humidity}%</Text>
              </View>
            )}
            {device.sensorData.fillLevel !== undefined && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="chart-bar" size={16} color={Colors.light.secondary} />
                <Text style={styles.sensorValue}>{device.sensorData.fillLevel}%</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>IoT Devices</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddDevice(true)}
        >
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {connectedDevices.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="microchip" size={60} color={Colors.light.text + '40'} />
            <Text style={styles.emptyTitle}>No Devices Connected</Text>
            <Text style={styles.emptySubtitle}>
              Connect your first IoT device to start monitoring your waste management system.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setShowAddDevice(true)}
            >
              <Text style={styles.emptyButtonText}>Add Device</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.devicesContainer}>
            <Text style={styles.sectionTitle}>Connected Devices ({connectedDevices.length})</Text>
            {connectedDevices.map(renderDeviceCard)}
          </View>
        )}
      </ScrollView>

      {/* Add Device Modal */}
      <Modal
        visible={showAddDevice}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddDevice(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddDevice(false)}>
              <FontAwesome5 name="times" size={24} color={Colors.light.text} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add New Device</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Device Type</Text>
              <View style={styles.typeSelector}>
                {[
                  { key: 'smart-bin', label: 'Smart Bin', icon: 'trash-alt' },
                  { key: 'sensor', label: 'Sensor', icon: 'thermometer-half' },
                  { key: 'camera', label: 'Camera', icon: 'camera' },
                ].map((type) => (
                  <TouchableOpacity
                    key={type.key}
                    style={[
                      styles.typeOption,
                      deviceType === type.key && styles.typeOptionActive
                    ]}
                    onPress={() => setDeviceType(type.key)}
                  >
                    <FontAwesome5 
                      name={type.icon as any} 
                      size={20} 
                      color={deviceType === type.key ? 'white' : Colors.light.text} 
                    />
                    <Text style={[
                      styles.typeLabel,
                      deviceType === type.key && styles.typeLabelActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="tag" size={20} color={Colors.light.primary} />
              <TextInput
                style={styles.input}
                placeholder="Device Name"
                value={deviceName}
                onChangeText={setDeviceName}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="microchip" size={20} color={Colors.light.primary} />
              <TextInput
                style={styles.input}
                placeholder="Device ID"
                value={deviceId}
                onChangeText={setDeviceId}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="wifi" size={20} color={Colors.light.primary} />
              <TextInput
                style={styles.input}
                placeholder="Wi-Fi Network Name"
                value={wifiSsid}
                onChangeText={setWifiSsid}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" size={20} color={Colors.light.primary} />
              <TextInput
                style={styles.input}
                placeholder="Wi-Fi Password"
                value={wifiPassword}
                onChangeText={setWifiPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]} 
              onPress={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.connectButtonText}>Connect Device</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.light.text + '80',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  devicesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 20,
  },
  deviceCard: {
    backgroundColor: Colors.light.card,
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 2,
  },
  deviceId: {
    fontSize: 14,
    color: Colors.light.text + '80',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statText: {
    fontSize: 12,
    color: Colors.light.text + '80',
    marginLeft: 6,
  },
  sensorData: {
    borderTopWidth: 1,
    borderTopColor: Colors.light.background,
    paddingTop: 12,
  },
  sensorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 8,
  },
  sensorGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sensorItem: {
    alignItems: 'center',
  },
  sensorValue: {
    fontSize: 12,
    color: Colors.light.text,
    marginTop: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.light.text,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.background,
    backgroundColor: Colors.light.card,
  },
  typeOptionActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  typeLabel: {
    fontSize: 12,
    color: Colors.light.text,
    marginLeft: 6,
    fontWeight: '600',
  },
  typeLabelActive: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
  connectButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  connectButtonDisabled: {
    backgroundColor: Colors.light.text + '40',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
