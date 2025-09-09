import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View as RNView,
  ScrollView,
  Switch,
} from 'react-native';
import { View } from '../../../components/Themed';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '../../../constants/Colors';
import { useLanguage } from '../../context/LanguageContext';
import { useColorScheme } from 'react-native';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  const { t, locale, setLanguage } = useLanguage();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || 'light'];

  // Dummy theme toggle function
  const toggleColorScheme = () => {
    // In a real app, you'd update the theme in your theme context
    console.log('Toggling color scheme');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={styles.headerTitle}>{t('settings')}</Text>
      </View>

      {/* Account Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('account')}</Text>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="user-circle" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome5 name="lock" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#fff" />
            <Text style={[styles.menuItemText, { color: '#fff' }]}>{t('logout')}</Text>
        </TouchableOpacity>
      </View>

      {/* Appearance Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>Appearance</Text>
        <View style={styles.menuItem}>
          <Ionicons name="moon" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>{t('darkMode')}</Text>
          <Switch
            value={colorScheme === 'dark'}
            onValueChange={toggleColorScheme}
            trackColor={{ false: '#767577', true: colors.accent }}
            thumbColor={colorScheme === 'dark' ? colors.primary : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Language Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>{t('language')}</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => setLanguage('en')}>
          <MaterialIcons name="language" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>{t('english')}</Text>
          {locale === 'en' && <FontAwesome5 name="check-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setLanguage('hi')}>
          <MaterialIcons name="language" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>{t('hindi')}</Text>
          {locale === 'hi' && <FontAwesome5 name="check-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => setLanguage('ta')}>
          <MaterialIcons name="language" size={20} color={colors.text} />
          <Text style={[styles.menuItemText, { color: colors.text }]}>{t('tamil')}</Text>
          {locale === 'ta' && <FontAwesome5 name="check-circle" size={20} color={colors.primary} />}
        </TouchableOpacity>
      </View>

      {/* Device Section */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <Text style={[styles.cardTitle, { color: colors.primary }]}>Device</Text>
        <Link href="/(user)/(tabs)/iot-connect" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="robot" size={20} color="#fff" />
            <Text style={styles.buttonText}>Connect Device</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'center',
    marginTop: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
