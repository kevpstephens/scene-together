import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { theme } from "../../theme";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import AnimatedButton from "../../components/AnimatedButton";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleDemoFill = () => {
    setEmail("demo@scenetogether.com");
    setPassword("DemoPassword123!");
    showToast("Demo credentials filled! 🎭", "success");
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
      showToast("Welcome back! 🎬", "success");
      // Navigation handled automatically by RootNavigator
    } catch (error: any) {
      showToast(error.message || "Login failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      showToast("Welcome back! 🎬", "success");
      // Navigation handled automatically by RootNavigator
    } catch (error: any) {
      showToast(
        error.message || "Google sign-in failed. Please try again.",
        "error"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🎬</Text>
        <Text style={styles.title}>SceneTogether</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>

        {/* Demo Credentials Banner */}
        <View style={styles.demoBanner}>
          <View style={styles.demoHeader}>
            <Text style={styles.demoIcon}>🎭</Text>
            <Text style={styles.demoTitle}>Demo Account</Text>
          </View>
          <Text style={styles.demoText}>
            <Text style={styles.demoLabel}>Email: </Text>
            demo@scenetogether.com
          </Text>
          <Text style={styles.demoText}>
            <Text style={styles.demoLabel}>Password: </Text>
            DemoPassword123!
          </Text>
          <TouchableOpacity style={styles.demoButton} onPress={handleDemoFill}>
            <Text style={styles.demoButtonText}>← Click to Auto-Fill</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />

          <AnimatedButton
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Signing In..." : "Sign In"}
            </Text>
          </AnimatedButton>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Google Sign In Button */}
          <AnimatedButton
            style={[
              styles.googleButton,
              googleLoading && styles.buttonDisabled,
            ]}
            onPress={handleGoogleSignIn}
            disabled={googleLoading}
          >
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleButtonText}>
              {googleLoading ? "Signing In..." : "Continue with Google"}
            </Text>
          </AnimatedButton>
        </View>

        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.linkText}>
            Don't have an account?{" "}
            <Text style={styles.linkTextBold}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  logo: {
    fontSize: theme.typography.fontSize.emoji,
    marginBottom: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxxl,
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.surface,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.base,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
  },
  linkButton: {
    marginTop: theme.spacing.lg,
  },
  linkText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  linkTextBold: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.base,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  googleIcon: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
  },
  googleButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  demoBanner: {
    backgroundColor: "#EFF6FF", // Light blue background
    borderWidth: 1,
    borderColor: "#93C5FD", // Blue border
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    marginBottom: theme.spacing.lg,
    width: "100%",
    maxWidth: 400,
    ...theme.shadows.sm,
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  demoIcon: {
    fontSize: theme.typography.fontSize.xl,
    marginRight: theme.spacing.xs,
  },
  demoTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#1E40AF", // Blue text
  },
  demoText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#1E3A8A", // Dark blue
    marginBottom: theme.spacing.xs,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  demoLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  demoButton: {
    backgroundColor: "#3B82F6", // Blue button
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    alignItems: "center",
  },
  demoButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
