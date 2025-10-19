import { useEffect, RefObject } from "react";
import { ScrollView, Platform } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

interface UseScrollToTopProps {
  scrollViewRef: RefObject<ScrollView | null>;
}

/**
 * Custom hook for handling scroll-to-top behavior when tab is pressed again
 * Similar to the Events tab behavior for consistent UX
 */
export const useScrollToTop = ({ scrollViewRef }: UseScrollToTopProps) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;

    const unsubscribe = (parent as any).addListener("tabPress", (e: any) => {
      // Only trigger scroll if screen is already focused (second tap)
      if (isFocused) {
        // Haptic feedback for premium feel
        if (Platform.OS !== "web") {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }

        // Scroll to top with animation
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }
      // If not focused, let default navigation happen (first tap)
    });

    return unsubscribe;
  }, [navigation, isFocused, scrollViewRef]);
};
