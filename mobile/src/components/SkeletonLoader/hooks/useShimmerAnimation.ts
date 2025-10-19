import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { shimmerConfig } from "../config/animation";

/**
 * Hook for managing shimmer animation
 */
export const useShimmerAnimation = () => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: shimmerConfig.duration,
          useNativeDriver: shimmerConfig.useNativeDriver,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: shimmerConfig.duration,
          useNativeDriver: shimmerConfig.useNativeDriver,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, [shimmerAnimation]);

  const opacity = shimmerAnimation.interpolate({
    inputRange: shimmerConfig.interpolation.inputRange,
    outputRange: shimmerConfig.interpolation.outputRange,
  });

  return { opacity };
};
