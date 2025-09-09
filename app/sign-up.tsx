import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Text, Image, Alert } from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from 'expo-router';
import Colors from "../constants/Colors";

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const handleGoogleSignUp = () => {
    // In a real app, you would integrate with a library like @react-native-google-signin/google-signin
    // For now, we'll just show an alert.
    Alert.alert("Google Sign-Up", "This feature is under development. Coming soon!");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/icon.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up as <Text style={{ color: Colors.light.primary, fontWeight: "bold" }}>{role === "admin" ? "Admin" : "User"}</Text></Text>
      
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
        placeholderTextColor={Colors.light.primary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={Colors.light.primary}
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
        style={styles.googleButton}
        onPress={handleGoogleSignUp}
      >
        <Image source={require("../assets/images/google.png")} style={styles.googleIcon} />
        <Text style={styles.googleButtonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace('/sign-in')}
        style={styles.link}
      >
        <Text style={styles.linkText}>Already have an account? <Text style={{ color: Colors.light.primary, fontWeight: "bold" }}>Sign In</Text></Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
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
    color: Colors.light.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 18,
  },
  toggleRow: {
    flexDirection: "row",
    marginBottom: 18,
    backgroundColor: Colors.light.secondary,
    borderRadius: 10,
    overflow: "hidden",
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleText: {
    fontSize: 16,
    color: Colors.light.text,
    fontWeight: "bold",
  },
  toggleTextActive: {
    color: "#fff",
  },
  input: {
    width: "100%",
    maxWidth: 350,
    backgroundColor: Colors.light.card,
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    fontSize: 16,
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.primary,
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
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: Colors.light.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 8,
  },
  linkText: {
    color: Colors.light.text,
    fontSize: 16,
  },
});