import React, { useRef } from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  Animated,
} from "react-native";
import * as Haptics from "expo-haptics";

type AnimatedButtonProps = TouchableOpacityProps & {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  springConfig?: {
    damping?: number;
    stiffness?: number;
  };
  enableHaptics?: boolean; // Enable/disable haptic feedback
};

export default function AnimatedButton({
  children,
  onPress,
  onPressIn,
  onPressOut,
  style,
  springConfig = { damping: 20, stiffness: 120 },
  enableHaptics = true,
  ...props
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    // Animate both scale and opacity gradually
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        friction: springConfig.damping,
        tension: springConfig.stiffness,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7, // Slightly greyed out
        duration: 150, // Gradual fade (150ms)
        useNativeDriver: true,
      }),
    ]).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    // Animate back to normal
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: springConfig.damping,
        tension: springConfig.stiffness,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1, // Back to full opacity
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onPressOut?.(e);
  };

  const handlePress = (e: any) => {
    // Only trigger haptics on successful tap (not during scroll)
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim, // Gradual opacity animation
      }}
    >
      <TouchableOpacity
        {...props}
        activeOpacity={1} // Disable instant opacity, use animated opacity
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
