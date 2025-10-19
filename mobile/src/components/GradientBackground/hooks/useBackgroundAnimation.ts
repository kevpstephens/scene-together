import { useRef, useEffect } from "react";
import { Animated } from "react-native";
import { theme } from "../../../theme";
import { animationConfig, colorInterpolation } from "../config/animations";

/**
 * Hook for managing background animations (color shift and circle breathing)
 */
export const useBackgroundAnimation = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;
  const scaleAnim3 = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Background color shift
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animationConfig.colorShift.duration,
          useNativeDriver: animationConfig.colorShift.useNativeDriver,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: animationConfig.colorShift.duration,
          useNativeDriver: animationConfig.colorShift.useNativeDriver,
        }),
      ])
    ).start();

    // Breathing animation for circle 1
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim1, {
          toValue: animationConfig.circle1.toValue,
          duration: animationConfig.circle1.duration,
          useNativeDriver: animationConfig.circle1.useNativeDriver,
        }),
        Animated.timing(scaleAnim1, {
          toValue: 1,
          duration: animationConfig.circle1.duration,
          useNativeDriver: animationConfig.circle1.useNativeDriver,
        }),
      ])
    ).start();

    // Breathing animation for circle 2
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim2, {
          toValue: animationConfig.circle2.toValue,
          duration: animationConfig.circle2.duration,
          useNativeDriver: animationConfig.circle2.useNativeDriver,
        }),
        Animated.timing(scaleAnim2, {
          toValue: 1,
          duration: animationConfig.circle2.duration,
          useNativeDriver: animationConfig.circle2.useNativeDriver,
        }),
      ])
    ).start();

    // Breathing animation for circle 3
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim3, {
          toValue: animationConfig.circle3.toValue,
          duration: animationConfig.circle3.duration,
          useNativeDriver: animationConfig.circle3.useNativeDriver,
        }),
        Animated.timing(scaleAnim3, {
          toValue: 1,
          duration: animationConfig.circle3.duration,
          useNativeDriver: animationConfig.circle3.useNativeDriver,
        }),
      ])
    ).start();
  }, [animatedValue, scaleAnim1, scaleAnim2, scaleAnim3]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: colorInterpolation.inputRange,
    outputRange: [
      theme.colors.background,
      "#15191F", // Subtle darker tint with hint of teal
      theme.colors.background,
    ],
  });

  return {
    backgroundColor,
    scaleAnim1,
    scaleAnim2,
    scaleAnim3,
  };
};
