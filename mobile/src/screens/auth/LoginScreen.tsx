import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Modal,
} from "react-native";
import GradientBackground from "../../components/GradientBackground";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/types";
import { theme } from "../../theme";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import AnimatedButton from "../../components/AnimatedButton";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAdminInfo, setShowAdminInfo] = useState(false);

  // Animation values
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Form entrance animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(formTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);
  }, []);

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
    <GradientBackground>
      {/* Admin Info Modal */}
      <Modal
        visible={showAdminInfo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAdminInfo(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAdminInfo(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <ShieldCheckIcon
                size={28}
                color={theme.colors.primary}
                style={styles.modalIcon}
              />
              <Text style={styles.modalTitle}>Admin Account</Text>
              <TouchableOpacity
                onPress={() => setShowAdminInfo(false)}
                style={styles.modalCloseButton}
              >
                <XMarkIcon size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              This is an <Text style={styles.modalBold}>admin account</Text>{" "}
              with special privileges.
            </Text>
            <Text style={styles.modalText}>
              Admin accounts are{" "}
              <Text style={styles.modalBold}>invite-only</Text> and grant the
              ability to:
            </Text>
            <View style={styles.modalList}>
              <Text style={styles.modalListItem}>• Create new events</Text>
              <Text style={styles.modalListItem}>• Edit existing events</Text>
              <Text style={styles.modalListItem}>• Delete events</Text>
              <Text style={styles.modalListItem}>• Manage attendees</Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
              },
            ]}
          >
            <Image
              source={require("../../../assets/logo/logo-transparent.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.Text
            style={[
              styles.subtitle,
              {
                opacity: logoOpacity,
              },
            ]}
          >
            Welcome back!
          </Animated.Text>

          {/* Demo Credentials Banner */}
          <Animated.View
            style={[
              styles.demoBanner,
              {
                transform: [{ translateY: formTranslateY }],
                opacity: formOpacity,
              },
            ]}
          >
            <View style={styles.demoHeader}>
              <ShieldCheckIcon
                size={24}
                color={theme.colors.primary}
                style={styles.demoIcon}
              />
              <Text style={styles.demoTitle}>Demo Admin Account</Text>
              <TouchableOpacity
                onPress={() => setShowAdminInfo(true)}
                style={styles.infoButton}
              >
                <InformationCircleIcon
                  size={20}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.demoText}>
              <Text style={styles.demoLabel}>Email: </Text>
              demo@scenetogether.com
            </Text>
            <Text style={styles.demoText}>
              <Text style={styles.demoLabel}>Password: </Text>
              DemoPassword123!
            </Text>
            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoFill}
            >
              <Text style={styles.demoButtonText}>← Click to Auto-Fill</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={[
              styles.form,
              {
                transform: [{ translateY: formTranslateY }],
                opacity: formOpacity,
              },
            ]}
          >
            {/* Email Input */}
            <View
              style={[
                styles.inputContainer,
                focusedInput === "email" && styles.inputContainerFocused,
              ]}
            >
              <EnvelopeIcon
                size={20}
                color={
                  focusedInput === "email"
                    ? theme.colors.primary
                    : theme.colors.text.tertiary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View
              style={[
                styles.inputContainer,
                focusedInput === "password" && styles.inputContainerFocused,
              ]}
            >
              <LockClosedIcon
                size={20}
                color={
                  focusedInput === "password"
                    ? theme.colors.primary
                    : theme.colors.text.tertiary
                }
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? (
                  <EyeIcon size={20} color={theme.colors.text.secondary} />
                ) : (
                  <EyeSlashIcon size={20} color={theme.colors.text.secondary} />
                )}
              </TouchableOpacity>
            </View>

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
          </Animated.View>

          <Animated.View
            style={{
              opacity: formOpacity,
            }}
          >
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text style={styles.linkText}>
                Don't have an account?{" "}
                <Text style={styles.linkTextBold}>Sign Up</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Bright frosted glass - makes logo pop
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, // More padding around logo
    marginBottom: theme.spacing.lg, // More breathing room after logo
    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)", // Light border for clean separation
    // Shadow with teal glow
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary, // Teal glow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow:
          "0 4px 16px rgba(70, 212, 175, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  logo: {
    width: 230, // Larger, more prominent
    height: 125,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg, // More breathing room
  },
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 0 12px rgba(70, 212, 175, 0.4)",
      },
    }),
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md, // Comfortable size
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md, // Better spacing
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
    marginTop: theme.spacing.base, // Good spacing
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
    marginVertical: theme.spacing.base, // Good spacing
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
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }
      : theme.shadows.sm),
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
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg, // More breathing room before form
    width: "100%",
    maxWidth: 400,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(70, 212, 175, 0.3)" }
      : theme.shadows.sm),
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  demoIcon: {
    marginRight: theme.spacing.xs,
  },
  demoTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  infoButton: {
    padding: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0 8px 32px rgba(70, 212, 175, 0.4)",
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  modalIcon: {
    marginRight: theme.spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  modalBold: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  modalList: {
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  modalListItem: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },
  demoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  demoLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  demoButton: {
    backgroundColor: theme.colors.primary,
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
