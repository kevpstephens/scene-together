import { useState, useEffect, RefObject } from "react";
import { FlatList, Platform } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Haptics from "expo-haptics";
import { EventsStackParamList } from "../../../navigation/types";

type NavigationProp = NativeStackNavigationProp<
  EventsStackParamList,
  "EventsList"
>;

interface UseHeaderAnimationProps {
  flatListRef: RefObject<FlatList | null>;
}

interface UseHeaderAnimationReturn {
  isHeaderVisible: boolean;
  setIsHeaderVisible: (visible: boolean) => void;
  handleScroll: (event: any) => void;
}

/**
 * Custom hook for managing header visibility and scroll-to-top on tab press
 */
export const useHeaderAnimation = ({
  flatListRef,
}: UseHeaderAnimationProps): UseHeaderAnimationReturn => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();

  // Handle tab press - scroll to top when already on this screen
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
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
      // If not focused, let default navigation happen (first tap)
    });

    return unsubscribe;
  }, [navigation, isFocused, flatListRef]);

  /**
   * Handle header visibility on scroll
   */
  const handleScroll = (event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;

    // Show header when at top (0-10px), hide when scrolled down
    if (scrollY <= 10) {
      setIsHeaderVisible(true);
    } else {
      setIsHeaderVisible(false);
    }
  };

  return {
    isHeaderVisible,
    setIsHeaderVisible,
    handleScroll,
  };
};
