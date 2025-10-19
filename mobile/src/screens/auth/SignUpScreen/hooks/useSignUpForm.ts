/*===============================================
 * useSignUpForm Hook
 * ==============================================
 * Manages signup form state and registration actions.
 * Handles email/password registration and Google OAuth.
 * ==============================================
 */

import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../../../contexts/auth";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../../navigation/types";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "SignUp">;

export const useSignUpForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const { signUp, signInWithGoogle } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const handleSignUp = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await signUp(email, password, name);
      Alert.alert(
        "Success!",
        "Account created! Please check your email to verify your account.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      // Navigation handled automatically by RootNavigator
    } catch (error: any) {
      Alert.alert("Google Sign In Failed", error.message || "Please try again");
    } finally {
      setGoogleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return {
    // State
    name,
    email,
    password,
    confirmPassword,
    loading,
    googleLoading,
    showPassword,
    showConfirmPassword,
    focusedInput,
    // Setters
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setFocusedInput,
    // Handlers
    handleSignUp,
    handleGoogleSignIn,
    togglePasswordVisibility,
    toggleConfirmPasswordVisibility,
  };
};
