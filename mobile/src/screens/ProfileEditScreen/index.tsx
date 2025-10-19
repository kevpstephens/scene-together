/*===============================================
 * Profile Edit Screen
 * ==============================================
 * User profile editing interface with form validation.
 * Allows users to update their name and email.
 * ==============================================
 */

import React, { useState } from "react";
import {
  View,
  Text,
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
import { ProfileStackParamList } from "../../navigation/types";
import { useAuth } from "../../contexts/auth";
import { theme } from "../../theme";
import { api } from "../../services/api";
import GradientBackground from "../../components/GradientBackground";
import { styles } from "./ProfileEditScreen.styles";

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
    <GradientBackground>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
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
    </GradientBackground>
  );
}
