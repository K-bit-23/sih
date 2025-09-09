import React from 'react';
import { StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { View, Text } from '../../../components/Themed';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsScreen() {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Language Selection */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Language', 'Language selection coming soon!')}>
        <Ionicons name="language" size={24} color="#27ae60" />
        <Text style={styles.label}>Language</Text>
        <Text style={styles.value}>English</Text>
      </TouchableOpacity>

      {/* Location Toggle */}
      <View style={styles.row}>
        <Ionicons name="location" size={24} color="#27ae60" />
        <Text style={styles.label}>Enable Location</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => Alert.alert('Location', 'Location services coming soon!')}
          value={true} // Replace with state
        />
      </View>

      {/* Dark Mode Toggle */}
      <View style={styles.row}>
        <FontAwesome name={colorScheme === 'dark' ? 'moon-o' : 'sun-o'} size={24} color="#27ae60" />
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={colorScheme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          value={colorScheme === 'dark'}
        />
      </View>

      {/* Tab Bar Customization */}
      <TouchableOpacity style={styles.row} onPress={() => Alert.alert('Customize Tabs', 'Tab customization coming soon!')}>
        <Ionicons name="options" size={24} color="#27ae60" />
        <Text style={styles.label}>Customize Bottom Tabs</Text>
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
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  label: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#7f8c8d',
  },
});
