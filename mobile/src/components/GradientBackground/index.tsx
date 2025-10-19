import React from "react";
import { View, Animated } from "react-native";
import { styles } from "./GradientBackground.styles";
import { useBackgroundAnimation } from "./hooks/useBackgroundAnimation";
import { AnimatedCircles } from "./components/AnimatedCircles";
import { BackgroundGradient } from "./components/BackgroundGradient";

interface GradientBackgroundProps {
  children?: React.ReactNode;
}

/**
 * Animated gradient background with decorative circles
 * Can be used standalone (no children) or as a wrapper (with children)
 */
export default function GradientBackground({
  children,
}: GradientBackgroundProps) {
  const { backgroundColor, scaleAnim1, scaleAnim2, scaleAnim3 } =
    useBackgroundAnimation();

  // If no children, render as standalone background (for screens that already have layout)
  if (!children) {
    return (
      <Animated.View
        style={[styles.standaloneContainer, { backgroundColor }]}
        pointerEvents="none"
      >
        <BackgroundGradient />
        <AnimatedCircles
          scaleAnim1={scaleAnim1}
          scaleAnim2={scaleAnim2}
          scaleAnim3={scaleAnim3}
        />
      </Animated.View>
    );
  }

  // If children provided, render as wrapper (for auth screens)
  return (
    <View style={styles.wrapper}>
      <Animated.View
        style={[styles.container, { backgroundColor }]}
        pointerEvents="none"
      >
        <BackgroundGradient />
        <AnimatedCircles
          scaleAnim1={scaleAnim1}
          scaleAnim2={scaleAnim2}
          scaleAnim3={scaleAnim3}
        />
      </Animated.View>
      {children}
    </View>
  );
}
