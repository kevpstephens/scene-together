/*===============================================
 * useProfileActions Hook
 * ==============================================
 * Manages profile-related actions like logout and refresh.
 * Includes haptic feedback and alert confirmations.
 * ==============================================
 */

import { useCallback } from "react";
import { Platform, Alert } from "react-native";
import * as Haptics from "expo-haptics";

interface UseProfileActionsProps {
  signOut: () => Promise<void>;
  fetchRSVPs: () => Promise<void>;
  fetchPaymentHistory: () => Promise<void>;
  setRefreshing: (refreshing: boolean) => void;
}

interface UseProfileActionsReturn {
  handleLogout: () => Promise<void>;
  onRefresh: () => Promise<void>;
}

/**
 * Custom hook for profile actions (logout, refresh)
 */
export const useProfileActions = ({
  signOut,
  fetchRSVPs,
  fetchPaymentHistory,
  setRefreshing,
}: UseProfileActionsProps): UseProfileActionsReturn => {
  /**
   * Handle user logout with confirmation
   */
  const handleLogout = useCallback(async () => {
    // On web, use native confirm dialog; on mobile, use Alert
    if (Platform.OS === "web") {
      const confirmed = window.confirm("Are you sure you want to sign out?");
      if (!confirmed) return;

      try {
        await signOut();
      } catch (error: any) {
        window.alert(error.message || "Failed to sign out");
      }
    } else {
      Alert.alert("Sign Out", "Are you sure you want to sign out?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to sign out");
            }
          },
        },
      ]);
    }
  }, [signOut]);

  /**
   * Pull to refresh handler
   */
  const onRefresh = useCallback(async () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setRefreshing(true);
    await Promise.all([fetchRSVPs(), fetchPaymentHistory()]);
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setRefreshing(false);
  }, [fetchRSVPs, fetchPaymentHistory, setRefreshing]);

  return {
    handleLogout,
    onRefresh,
  };
};
