import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../SignUpScreen.styles";
import AnimatedButton from "../../../../components/AnimatedButton";

interface SignUpFormProps {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  googleLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  focusedInput: string | null;
  formTranslateY: Animated.Value;
  formOpacity: Animated.Value;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onNameFocus: () => void;
  onEmailFocus: () => void;
  onPasswordFocus: () => void;
  onConfirmPasswordFocus: () => void;
  onBlur: () => void;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  onSignUp: () => void;
  onGoogleSignIn: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({
  name,
  email,
  password,
  confirmPassword,
  loading,
  googleLoading,
  showPassword,
  showConfirmPassword,
  focusedInput,
  formTranslateY,
  formOpacity,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onNameFocus,
  onEmailFocus,
  onPasswordFocus,
  onConfirmPasswordFocus,
  onBlur,
  onTogglePassword,
  onToggleConfirmPassword,
  onSignUp,
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
      {/* Name Input */}
      <View
        style={[
          styles.inputContainer,
          focusedInput === "name" && styles.inputContainerFocused,
        ]}
      >
        <UserIcon
          size={20}
          color={
            focusedInput === "name"
              ? theme.colors.primary
              : theme.colors.text.tertiary
          }
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor={theme.colors.text.tertiary}
          value={name}
          onChangeText={onNameChange}
          onFocus={onNameFocus}
          onBlur={onBlur}
          autoCapitalize="words"
          autoComplete="name"
        />
      </View>

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
          autoComplete="password-new"
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

      {/* Confirm Password Input */}
      <View
        style={[
          styles.inputContainer,
          focusedInput === "confirmPassword" && styles.inputContainerFocused,
        ]}
      >
        <LockClosedIcon
          size={20}
          color={
            focusedInput === "confirmPassword"
              ? theme.colors.primary
              : theme.colors.text.tertiary
          }
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.text.tertiary}
          value={confirmPassword}
          onChangeText={onConfirmPasswordChange}
          onFocus={onConfirmPasswordFocus}
          onBlur={onBlur}
          secureTextEntry={!showConfirmPassword}
          autoComplete="password-new"
        />
        <TouchableOpacity
          onPress={onToggleConfirmPassword}
          style={styles.passwordToggle}
        >
          {showConfirmPassword ? (
            <EyeIcon size={20} color={theme.colors.text.secondary} />
          ) : (
            <EyeSlashIcon size={20} color={theme.colors.text.secondary} />
          )}
        </TouchableOpacity>
      </View>

      <AnimatedButton
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={onSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating Account..." : "Sign Up"}
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
