/**
 * Animation configuration for background effects
 */
export const animationConfig = {
  // Background color shift animation
  colorShift: {
    duration: 8000,
    useNativeDriver: false,
  },
  // Breathing circle animations (staggered)
  circle1: {
    toValue: 1.2,
    duration: 5000,
    useNativeDriver: true,
  },
  circle2: {
    toValue: 1.15,
    duration: 6000,
    useNativeDriver: true,
  },
  circle3: {
    toValue: 1.3,
    duration: 7000,
    useNativeDriver: true,
  },
};

/**
 * Interpolation config for background color
 */
export const colorInterpolation = {
  inputRange: [0, 0.5, 1] as const,
  // outputRange will be provided at runtime with theme colors
};
