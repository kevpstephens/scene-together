import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ProfileStackParamList } from "../navigation/types";
import { useAuth } from "../contexts/AuthContext";
import { theme } from "../theme";
import { api } from "../services/api";

type NavigationProp = NativeStackNavigationProp<
  ProfileStackParamList,
  "ProfileEdit"
>;

export default function ProfileEditScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { userProfile, refreshUserRole } = useAuth();

  const [name, setName] = useState(userProfile?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatarUrl || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      if (Platform.OS === "web") {
        window.alert("Please enter your name");
      } else {
        Alert.alert("Validation Error", "Please enter your name");
      }
      return;
    }

    setSubmitting(true);
    try {
      await api.patch("/auth/me", {
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || null,
      });

      // Refresh user profile to get updated data
      await refreshUserRole();

      if (Platform.OS === "web") {
        window.alert("Profile updated successfully");
        navigation.goBack();
      } else {
        Alert.alert("Success", "Profile updated successfully", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to update profile";
      if (Platform.OS === "web") {
        window.alert(errorMessage);
      } else {
        Alert.alert("Error", errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>Edit Profile</Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={theme.colors.text.tertiary}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Avatar URL</Text>
              <TextInput
                style={styles.input}
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://example.com/avatar.jpg"
                placeholderTextColor={theme.colors.text.tertiary}
                autoCapitalize="none"
                keyboardType="url"
              />
              <Text style={styles.hint}>
                Enter a URL to an image for your profile picture
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.button, submitting && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={theme.colors.text.inverse} />
              ) : (
                <Text style={styles.buttonText}>Save Changes</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={submitting}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.lg,
  },
  inputGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  hint: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    alignItems: "center",
    marginTop: theme.spacing.base,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  cancelButton: {
    padding: theme.spacing.base,
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.fontSize.base,
  },
});
