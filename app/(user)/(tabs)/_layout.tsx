import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const { t } = useLanguage();

  const colors = {
    light: {
      active: '#27ae60',
      inactive: '#7f8c8d',
      background: '#ffffff',
      borderTop: '#ecf0f1',
    },
    dark: {
      active: '#2ecc71',
      inactive: '#95a5a6',
      background: '#2c3e50',
      borderTop: '#34495e',
    },
  };

  const currentColors = colors[colorScheme];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: currentColors.active,
        tabBarInactiveTintColor: currentColors.inactive,
        tabBarStyle: {
          backgroundColor: currentColors.background,
          borderTopWidth: 1,
          borderTopColor: currentColors.borderTop,
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: t('dashboard'),
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="tachometer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: t('analysis'),
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="iot-connect"
        options={{
          title: t('iot'),
          tabBarIcon: ({ color }) => <Ionicons size={28} name="hardware-chip" color={color} />,
        }}
      />
        <Tabs.Screen
        name="maps"
        options={{
          title: t('maps'),
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
        }}
      />
        <Tabs.Screen
        name="rewards"
        options={{
          title: t('rewards'),
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gift" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <Ionicons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
