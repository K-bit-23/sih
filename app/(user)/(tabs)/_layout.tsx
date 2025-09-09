import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function TabLayout() {
  const { colorScheme } = useTheme();

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
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="tachometer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tabs.Screen
        name="iot-connect"
        options={{
          title: 'IoT',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="hardware-chip" color={color} />,
        }}
      />
        <Tabs.Screen
        name="maps"
        options={{
          title: 'Maps',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="map" color={color} />,
        }}
      />
        <Tabs.Screen
        name="rewards"
        options={{
          title: 'Rewards',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="gift" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="settings" color={color} />,
        }}
      />
    </Tabs>
  );
}
