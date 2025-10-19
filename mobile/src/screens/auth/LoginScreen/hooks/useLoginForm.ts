import { useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useToast } from "../../../../contexts/ToastContext";

export const useLoginForm = () => {
  const { signIn, signInWithGoogle } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showAdminInfo, setShowAdminInfo] = useState(false);

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleAdminInfo = () => {
    setShowAdminInfo(!showAdminInfo);
  };

  return {
    // State
    email,
    password,
    loading,
    googleLoading,
    showPassword,
    focusedInput,
    showAdminInfo,
    // Setters
    setEmail,
    setPassword,
    setFocusedInput,
    // Handlers
    handleDemoFill,
    handleLogin,
    handleGoogleSignIn,
    togglePasswordVisibility,
    toggleAdminInfo,
  };
};
