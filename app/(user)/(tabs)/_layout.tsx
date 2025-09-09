import { Tabs } from "expo-router";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Colors from "../../../constants/Colors";

const Layout = () => {
  const colorScheme = useColorScheme();

  const theme = {
    light: {
      active: Colors.light.primary,
      inactive: "#A1A1A1",
      background: "#FFFFFF",
      borderTop: "#EEEEEE",
    },
    dark: {
      active: Colors.dark.primary,
      inactive: "#A1A1A1",
      background: "#000000",
      borderTop: "#222222",
    },
  };

  const currentTheme = theme[colorScheme || "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentTheme.active,
        tabBarInactiveTintColor: currentTheme.inactive,
        tabBarStyle: {
          backgroundColor: currentTheme.background,
          borderTopColor: currentTheme.borderTop,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gift" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="iot-connect"
        options={{
          title: "IoT Connect",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="hardware-chip" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maps"
        options={{
          title: "Maps",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="map" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons size={28} name="settings" color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
