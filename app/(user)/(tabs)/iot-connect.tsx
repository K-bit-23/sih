import { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  Modal,
  View,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

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

// Mock Data
const mockDevices: IoTDevice[] = [
  {
    id: '1',
    deviceId: 'a1:b2:c3:d4:e5:f6',
    name: 'Smart Bin 1',
    type: 'smart-bin',
    status: 'online',
    lastSeen: new Date(),
    wifiSsid: 'Eco-Net',
    batteryLevel: 80,
    sensorData: {
      temperature: 25,
      humidity: 60,
      fillLevel: 45,
    },
  },
  {
    id: '2',
    deviceId: 'a2:b3:c4:d5:e6:f7',
    name: 'Environmental Sensor',
    type: 'sensor',
    status: 'offline',
    lastSeen: new Date(Date.now() - 86400000),
    wifiSsid: 'City-WiFi',
    batteryLevel: 20,
    sensorData: {
      temperature: 12,
      humidity: 90,
    },
  },
  {
    id: '3',
    deviceId: 'a3:b4:c5:d6:e7:f8',
    name: 'Recycling Center Cam',
    type: 'camera',
    status: 'connecting',
    lastSeen: new Date(),
    wifiSsid: 'Public-WiFi',
    batteryLevel: 95,
  },
];

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
    setLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setConnectedDevices(mockDevices);
      setLoading(false);
    }, 1500);
  };

  const handleConnect = async () => {
    if (!deviceId || !deviceName || !wifiSsid || !wifiPassword) {
      Alert.alert(t('error'), 'Please fill in all fields');
      return;
    }

    setIsConnecting(true);

    // Simulate device connection process
    setTimeout(() => {
      const newDevice: IoTDevice = {
        id: Math.random().toString(),
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
      };

      setConnectedDevices([newDevice, ...connectedDevices]);
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
    }, 2000);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart-bin':
        return 'trash-alt';
      case 'sensor':
        return 'thermometer-half';
      case 'camera':
        return 'camera';
      default:
        return 'microchip';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return '#4CAF50';
      case 'offline':
        return '#F44336';
      case 'connecting':
        return '#FF9800';
      default:
        return '#000';
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
            <FontAwesome5 name="battery-three-quarters" size={14} color={'#000'} />
            <Text style={styles.statText}>{device.batteryLevel}%</Text>
          </View>
        )}
        <View style={styles.statItem}>
          <FontAwesome5 name="wifi" size={14} color={'#000'} />
          <Text style={styles.statText}>{device.wifiSsid}</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="clock" size={14} color={'#000'} />
          <Text style={styles.statText}>{device.lastSeen.toLocaleDateString()}</Text>
        </View>
      </View>

      {device.sensorData && (
        <View style={styles.sensorData}>
          <Text style={styles.sensorTitle}>Sensor Data</Text>
          <View style={styles.sensorGrid}>
            {device.sensorData.temperature && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="thermometer-half" size={16} color={'#4CAF50'} />
                <Text style={styles.sensorValue}>{device.sensorData.temperature}°C</Text>
              </View>
            )}
            {device.sensorData.humidity && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="tint" size={16} color={'#00BCD4'} />
                <Text style={styles.sensorValue}>{device.sensorData.humidity}%</Text>
              </View>
            )}
            {device.sensorData.fillLevel !== undefined && (
              <View style={styles.sensorItem}>
                <FontAwesome5 name="chart-bar" size={16} color={'#FF9800'} />
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
        <ActivityIndicator size="large" color={'#4CAF50'} />
        <Text style={styles.loadingText}>Loading devices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4CAF50', '#00BCD4']} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>IoT Devices</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddDevice(true)}>
          <FontAwesome5 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {connectedDevices.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="microchip" size={60} color={'#000' + '40'} />
            <Text style={styles.emptyTitle}>No Devices Connected</Text>
            <Text style={styles.emptySubtitle}>
              Connect your first IoT device to start monitoring your waste management system.
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={() => setShowAddDevice(true)}>
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
              <FontAwesome5 name="times" size={24} color={'#000'} />
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
                      deviceType === type.key && styles.typeOptionActive,
                    ]}
                    onPress={() => setDeviceType(type.key)}
                  >
                    <FontAwesome5
                      name={type.icon as any}
                      size={20}
                      color={deviceType === type.key ? 'white' : '#000'}
                    />
                    <Text
                      style={[
                        styles.typeLabel,
                        deviceType === type.key && styles.typeLabelActive,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="tag" size={20} color={'#4CAF50'} />
              <TextInput
                style={styles.input}
                placeholder="Device Name"
                value={deviceName}
                onChangeText={setDeviceName}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="microchip" size={20} color={'#4CAF50'} />
              <TextInput
                style={styles.input}
                placeholder="Device ID"
                value={deviceId}
                onChangeText={setDeviceId}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="wifi" size={20} color={'#4CAF50'} />
              <TextInput
                style={styles.input}
                placeholder="Wi-Fi Network Name"
                value={wifiSsid}
                onChangeText={setWifiSsid}
              />
            </View>

            <View style={styles.inputContainer}>
              <FontAwesome5 name="lock" size={20} color={'#4CAF50'} />
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#000',
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
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#000' + '80',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  emptyButton: {
    backgroundColor: '#4CAF50',
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
    color: '#000',
    marginBottom: 20,
  },
  deviceCard: {
    backgroundColor: '#f8f8f8',
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
    color: '#000',
    marginBottom: 2,
  },
  deviceId: {
    fontSize: 14,
    color: '#000' + '80',
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
    color: '#000' + '80',
    marginLeft: 6,
  },
  sensorData: {
    borderTopWidth: 1,
    borderTopColor: '#fff',
    paddingTop: 12,
  },
  sensorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
    marginTop: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
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
    color: '#000',
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
    borderColor: '#fff',
    backgroundColor: '#f8f8f8',
  },
  typeOptionActive: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  typeLabel: {
    fontSize: 12,
    color: '#000',
    marginLeft: 6,
    fontWeight: '600',
  },
  typeLabelActive: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#fff',
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  connectButtonDisabled: {
    backgroundColor: '#000' + '40',
  },
  connectButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});