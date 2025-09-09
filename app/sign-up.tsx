import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, Image } from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up as <Text style={{ color: "#27ae60", fontWeight: "bold" }}>{role === "admin" ? "Admin" : "User"}</Text></Text>
      
      {/* Toggle Admin/User */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, role === "user" && styles.toggleActive]}
          onPress={() => setRole("user")}
        >
          <Text style={[styles.toggleText, role === "user" && styles.toggleTextActive]}>User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, role === "admin" && styles.toggleActive]}
          onPress={() => setRole("admin")}
        >
          <Text style={[styles.toggleText, role === "admin" && styles.toggleTextActive]}>Admin</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#27ae60"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#27ae60"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/sign-in')}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.replace('/sign-in')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Already have an account? <Text style={{ color: "#27ae60", fontWeight: "bold" }}>Sign In</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eafaf1",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#27ae60",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#145a32",
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 18,
    backgroundColor: "#d4efdf",
    borderRadius: 10,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: "#27ae60",
  },
  toggleText: {
    fontSize: 16,
    color: "#145a32",
    fontWeight: "bold",
  },
  toggleTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#27ae60",
    fontSize: 16,
    color: "#145a32",
  },
  button: {
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: "#145a32",
    fontSize: 16,
  },
});