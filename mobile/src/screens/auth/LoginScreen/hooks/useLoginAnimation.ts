/*===============================================
 * useLoginAnimation Hook
 * ==============================================
 * Manages entrance animations for the login screen.
 * Provides smooth logo and form fade-in effects.
 * ==============================================
 */

import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useLoginAnimation = () => {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(30)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo entrance animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Form entrance animation (delayed)
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(formTranslateY, {
          toValue: 0,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 200);
  }, [logoScale, logoOpacity, formTranslateY, formOpacity]);

  return {
    logoScale,
    logoOpacity,
    formTranslateY,
    formOpacity,
  };
};
