import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  Alert,
  Image,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { View } from '../../components/Themed';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useLanguage } from '../context/LanguageContext';

export default function IoTConnectScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const { t } = useLanguage();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    setIsConnecting(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);

    // Simulate a connection process
    setTimeout(() => {
      setIsConnecting(false);
      setConnected(true);
      Alert.alert(t('deviceConnected'), t('successfullyConnectedToDevice').replace('{{device}}', data))
    }, 2000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const fileUri = result.assets[0].uri;
      if (Platform.OS === 'web' && result.assets[0].base64) {
        // Barcode scanner for web needs a different approach
        // This is a placeholder for web-based QR code scanning
        Alert.alert(t('error'), t('couldNotScanQRCode'));
      } else if (fileUri) {
        try {
            const scannedResults = await BarCodeScanner.scanFromURLAsync(fileUri);
            if (scannedResults.length > 0) {
                handleBarCodeScanned(scannedResults[0]);
            } else {
                Alert.alert(t('noQRCodeFound'));
            }
        } catch (error) {
            console.error("Error scanning QR code from image: ", error);
            Alert.alert(t('error'), t('couldNotScanQRCode'));
        }
      }
    }
  };

  const startAnimation = () => {
    animation.setValue(0);
    Animated.loop(
      Animated.timing(animation, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  };

  useEffect(() => {
    if (hasPermission === true) {
        startAnimation();
    }
  }, [hasPermission]);

  const scanAreaSize = 250;
  const scanAreaY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scanAreaSize],
  });

  if (hasPermission === null) {
    return <Text>{t('requestingCameraPermission')}</Text>;
  }
  if (hasPermission === false) {
    return <Text>{t('noCameraAccess')}</Text>;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.light.primary, Colors.light.accent]} // Use your theme colors
        style={styles.header}
      >
        <Text style={styles.headerText}>{t('connectToYourDevice')}</Text>
        <Text style={styles.subHeaderText}>{t('scanQRCodeToGetStarted')}</Text>
      </LinearGradient>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.scanArea}>
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanAreaY }] }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
          <FontAwesome5 name="images" size={24} color="white" />
          <Text style={styles.galleryButtonText}>{t('scanFromGallery')}</Text>
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
          <TouchableOpacity style={styles.tryAgainButton} onPress={() => { setConnected(false); setScanned(false); }}>
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
    backgroundColor: '#000',
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
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  scanLine: {
    width: '100%',
    height: 2,
    backgroundColor: '#6200ee',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  galleryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
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
