/*===============================================
 * Login Screen
 * ==============================================
 * Authentication entry point with email/password and Google OAuth.
 * Features:
 * - Animated logo and form entrance
 * - Email/password authentication
 * - Google OAuth sign-in
 * - Demo admin credentials display
 * - Password visibility toggle
 * ==============================================
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GradientBackground from "../../../components/GradientBackground";
import { AuthStackParamList } from "../../../navigation/types";
import { useLoginAnimation, useLoginForm } from "./hooks";
import { AdminInfoModal, DemoBanner, LoginForm } from "./components";
import { styles } from "./LoginScreen.styles";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Custom hooks for animation and form logic
  const { logoScale, logoOpacity, formTranslateY, formOpacity } =
    useLoginAnimation();

  const {
    email,
    password,
    loading,
    googleLoading,
    showPassword,
    focusedInput,
    showAdminInfo,
    setEmail,
    setPassword,
    setFocusedInput,
    handleDemoFill,
    handleLogin,
    handleGoogleSignIn,
    togglePasswordVisibility,
    toggleAdminInfo,
  } = useLoginForm();

  return (
    <GradientBackground>
      <AdminInfoModal visible={showAdminInfo} onClose={toggleAdminInfo} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          {/* Logo */}
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
              source={require("../../../../assets/logo/logo-transparent.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Subtitle */}
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
          <DemoBanner
            onDemoFill={handleDemoFill}
            onShowInfo={toggleAdminInfo}
            formTranslateY={formTranslateY}
            formOpacity={formOpacity}
          />

          {/* Login Form */}
          <LoginForm
            email={email}
            password={password}
            loading={loading}
            googleLoading={googleLoading}
            showPassword={showPassword}
            focusedInput={focusedInput}
            formTranslateY={formTranslateY}
            formOpacity={formOpacity}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onEmailFocus={() => setFocusedInput("email")}
            onPasswordFocus={() => setFocusedInput("password")}
            onBlur={() => setFocusedInput(null)}
            onTogglePassword={togglePasswordVisibility}
            onLogin={handleLogin}
            onGoogleSignIn={handleGoogleSignIn}
          />

          {/* Sign Up Link */}
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
