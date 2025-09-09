import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  View as RNView,
} from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false); // This should be loaded from a shared storage

  useEffect(() => {
    // In a real app, you would load this from AsyncStorage or a global state management solution
    // For this example, we'll just keep it in the component's state.
    // We will assume that the user has enabled it in the settings page.
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    // For the purpose of this demo, we'll just assume biometric is enabled if available.
    // In a real app, this would be tied to the switch in the settings page.
    if (hasHardware && isEnrolled) {
        setIsBiometricEnabled(true);
    }
  }

  const handleBiometricSignIn = async () => {
    if (!isBiometricEnabled) {
        showAlert("Biometric Not Enabled", "Please enable biometric authentication in the settings.");
        return;
    }

    try {
      const { success } = await LocalAuthentication.authenticateAsync({
        promptMessage: "Sign in with your fingerprint",
      });

      if (success) {
        showAlert("Biometric Login Successful", "Welcome back!");
        router.replace("/dashboard" as any);
      } else {
        showAlert("Biometric Login Failed", "Please try again.");
      }
    } catch (error) {
      showAlert("Error", "An error occurred during biometric authentication.");
    }
  };


  const handleSignIn = () => {
    if (email === "" || password === "") {
      showAlert("Missing Fields ❗", "Please enter both email and password.");
      return;
    }

    if (role === "admin") {
      if (email === "admin" && password === "admin") {
        showAlert("👨‍💻 Admin Login", "Welcome back, Admin!");
        router.replace("/admin" as any);
      } else {
        showAlert("Login Failed", "Invalid admin credentials.");
      }
    } else {
      showAlert("🙋‍♂️ User Login", "Welcome back, User!");
      router.replace("/dashboard" as any);
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>🌱 Welcome Back!</Text>
      <Text style={styles.subtitle}>
        {role === "admin" ? "Sign in as Admin" : "Sign in as User"}
      </Text>

      {/* Role Toggle */}
      <View style={styles.roleToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, role === "user" && styles.activeButton]}
          onPress={() => setRole("user")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "user" && styles.activeToggleText,
            ]}
          >
            User
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, role === "admin" && styles.activeButton]}
          onPress={() => setRole("admin")}
        >
          <Text
            style={[
              styles.toggleText,
              role === "admin" && styles.activeToggleText,
            ]}
          >
            Admin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#7fbf7f"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#7fbf7f"
      />

      {/* Forgot Password */}
      <TouchableOpacity
        style={styles.forgotPassword}
        onPress={() => showAlert("🔑 Forgot Password", "Password recovery coming soon!")}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Sign-In Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      {/* Biometric Button */}
      {isBiometricEnabled && (
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricSignIn}>
          <Ionicons name="finger-print" size={32} color="#43a047" />
        </TouchableOpacity>
      )}

      {/* Google Icon */}
      <TouchableOpacity
        style={styles.googleIconButton}
        onPress={() => showAlert("🔗 Google Login", "Google sign-in coming soon!")}
      >
        <Image
          source={require("../assets/images/google.png")}
          style={styles.googleIcon}
        />
      </TouchableOpacity>

      {/* Sign-Up Navigation */}
      <Text style={styles.signUpText}>
        Don't have an account?{" "}
        <Text
          style={styles.signUpLink}
          onPress={() => router.replace("/sign-up")}
        >
          Sign Up
        </Text>
      </Text>

      {/* Custom Alert Modal */}
      <Modal transparent={true} visible={alertVisible} animationType="fade">
        <RNView style={styles.modalContainer}>
          <RNView style={styles.modalBox}>
            <Text style={styles.modalTitle}>{alertTitle}</Text>
            <Text style={styles.modalMessage}>{alertMessage}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setAlertVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#e9f7ef",
  },
  welcome: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#388e3c",
    textAlign: "center",
    marginBottom: 24,
  },
  roleToggle: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: "#c8e6c9",
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: "#43a047",
  },
  toggleText: {
    fontSize: 16,
    color: "#388e3c",
    fontWeight: "600",
  },
  activeToggleText: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#a5d6a7",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: "#1b5e20",
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#43a047",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  biometricButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  googleIconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
    alignSelf: "center",
    marginBottom: 24,
  },
  googleIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  signUpText: {
    textAlign: "center",
    fontSize: 14,
    color: "#388e3c",
  },
  signUpLink: {
    color: "#1b5e20",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 10,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#43a047",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});