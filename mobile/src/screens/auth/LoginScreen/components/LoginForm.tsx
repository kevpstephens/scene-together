import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../LoginScreen.styles";
import AnimatedButton from "../../../../components/AnimatedButton";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  googleLoading: boolean;
  showPassword: boolean;
  focusedInput: string | null;
  formTranslateY: Animated.Value;
  formOpacity: Animated.Value;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onEmailFocus: () => void;
  onPasswordFocus: () => void;
  onBlur: () => void;
  onTogglePassword: () => void;
  onLogin: () => void;
  onGoogleSignIn: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  loading,
  googleLoading,
  showPassword,
  focusedInput,
  formTranslateY,
  formOpacity,
  onEmailChange,
  onPasswordChange,
  onEmailFocus,
  onPasswordFocus,
  onBlur,
  onTogglePassword,
  onLogin,
  onGoogleSignIn,
}) => {
  return (
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
          onChangeText={onEmailChange}
          onFocus={onEmailFocus}
          onBlur={onBlur}
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
          onChangeText={onPasswordChange}
          onFocus={onPasswordFocus}
          onBlur={onBlur}
          secureTextEntry={!showPassword}
          autoComplete="password"
        />
        <TouchableOpacity
          onPress={onTogglePassword}
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
        onPress={onLogin}
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
        style={[styles.googleButton, googleLoading && styles.buttonDisabled]}
        onPress={onGoogleSignIn}
        disabled={googleLoading}
      >
        <Text style={styles.googleIcon}>G</Text>
        <Text style={styles.googleButtonText}>
          {googleLoading ? "Signing In..." : "Continue with Google"}
        </Text>
      </AnimatedButton>
    </Animated.View>
  );
};
