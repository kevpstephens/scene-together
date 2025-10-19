import { useEffect, useRef } from "react";
import { Animated } from "react-native";

/**
 * Custom hook for managing event detail screen animations
 * Handles scroll-based parallax and entrance animations
 */
export const useEventAnimation = () => {
  // Animation values for scroll-based effects
  const scrollY = useRef(new Animated.Value(0)).current;

  // Entrance animation values
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Scale and fade in animation on mount
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, opacityAnim]);

  return {
    scrollY,
    scaleAnim,
    opacityAnim,
  };
};
