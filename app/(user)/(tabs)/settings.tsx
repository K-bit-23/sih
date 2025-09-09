import React, { useState } from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();
  const { t, setLanguage, locale } = useLanguage();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

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


  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t('settings')}</Text>

      {/* Account Section */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert(t('account'), t('account') + ' settings coming soon!')}>
        <MaterialCommunityIcons name="account-circle-outline" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('account')}</Text>
      </TouchableOpacity>

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
          onValueChange={() => setIsBiometricEnabled(previousState => !previousState)}
          value={isBiometricEnabled}
        />
      </View>

      {/* Tab Bar Customization */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert(t('customizeTabs'), t('customizeTabs') + ' coming soon!')}>
        <Ionicons name="options" size={24} color="#27ae60" />
        <Text style={styles.label}>{t('customizeTabs')}</Text>
      </TouchableOpacity>
      
      {/* Logout Button */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert(t('logout'), t('logoutMessage'))}>
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
});
