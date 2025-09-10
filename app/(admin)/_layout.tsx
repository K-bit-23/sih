import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";

export default function AdminLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme || "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.borderTop,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="users" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
