/*===============================================
 * Sign Up Screen
 * ==============================================
 * New user registration with email/password or Google OAuth.
 * Features:
 * - Name, email, and password collection
 * - Form validation
 * - Password visibility toggle
 * - Google OAuth registration
 * - Navigate to login if account exists
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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GradientBackground from "../../../components/GradientBackground";
import { AuthStackParamList } from "../../../navigation/types";
import { useAuthAnimation, useSignUpForm } from "./hooks";
import { SignUpForm } from "./components";
import { styles } from "./SignUpScreen.styles";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

export default function SignUpScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Custom hooks for animation and form logic
  const { logoScale, logoOpacity, formTranslateY, formOpacity } =
    useAuthAnimation();

  const {
    name,
    email,
    password,
    confirmPassword,
    loading,
    googleLoading,
    showPassword,
    showConfirmPassword,
    focusedInput,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFocusedInput,
    handleSignUp,
    handleGoogleSignIn,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  } = useSignUpForm();

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
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
              Create your account
            </Animated.Text>

            {/* Sign Up Form */}
            <SignUpForm
              name={name}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              loading={loading}
              googleLoading={googleLoading}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              focusedInput={focusedInput}
              formTranslateY={formTranslateY}
              formOpacity={formOpacity}
              onNameChange={setName}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onNameFocus={() => setFocusedInput("name")}
              onEmailFocus={() => setFocusedInput("email")}
              onPasswordFocus={() => setFocusedInput("password")}
              onConfirmPasswordFocus={() => setFocusedInput("confirmPassword")}
              onBlur={() => setFocusedInput(null)}
              onTogglePassword={togglePasswordVisibility}
              onToggleConfirmPassword={toggleConfirmPasswordVisibility}
              onSignUp={handleSignUp}
              onGoogleSignIn={handleGoogleSignIn}
            />

            {/* Login Link */}
            <Animated.View
              style={{
                opacity: formOpacity,
              }}
            >
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.linkText}>
                  Already have an account?{" "}
                  <Text style={styles.linkTextBold}>Log In</Text>
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}
