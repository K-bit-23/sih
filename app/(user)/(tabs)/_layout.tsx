import { Tabs } from 'expo-router';
import React from 'react';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#27ae60',
        tabBarInactiveTintColor: '#7f8c8d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#ecf0f1',
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
