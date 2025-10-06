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
};

export default function AnimatedButton({
  children,
  onPressIn,
  onPressOut,
  style,
  springConfig = { damping: 15, stiffness: 150 },
  ...props
}: AnimatedButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (e: any) => {
    // Haptic feedback on press
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.spring(scaleAnim, {
      toValue: 0.96,
      friction: springConfig.damping,
      tension: springConfig.stiffness,
      useNativeDriver: true,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: springConfig.damping,
      tension: springConfig.stiffness,
      useNativeDriver: true,
    }).start();
    onPressOut?.(e);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        {...props}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={style}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
