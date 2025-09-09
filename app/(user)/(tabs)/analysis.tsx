
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Image, Modal, View as RNView } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import * as ImagePicker from 'expo-image-picker';

export default function AnalysisScreen() {
  const { t } = useLanguage();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async (type: 'camera' | 'gallery') => {
    const permission = type === 'camera' 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permission.status !== 'granted') {
      Alert.alert(t(type === 'camera' ? 'cameraPermissionRequired' : 'galleryPermissionRequired'));
      return;
    }

    const result = type === 'camera'
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false);
      // TODO: Add ML model integration here
      Alert.alert(t('analysisResult'), t('biodegradable'));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('analysis')}</Text>

      <TouchableOpacity style={styles.imageContainer} onPress={() => setModalVisible(true)}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <FontAwesome name="camera" size={50} color="#ccc" />
            <Text style={styles.placeholderText}>{t('uploadImage')}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <RNView style={styles.modalContainer}>
          <RNView style={styles.modalBox}>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('camera')}>
              <Text style={styles.modalButtonText}>{t('takePicture')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => handleImagePicker('gallery')}>
              <Text style={styles.modalButtonText}>{t('uploadImage')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#c0392b' }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f6fff9',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#27ae60',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ccc',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 10,
  },
  modalButton: {
    backgroundColor: '#43a047',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
