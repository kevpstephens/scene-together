import React from "react";
import { Animated } from "react-native";
import { styles } from "../GradientBackground.styles";

interface AnimatedCirclesProps {
  scaleAnim1: Animated.Value;
  scaleAnim2: Animated.Value;
  scaleAnim3: Animated.Value;
}

/**
 * Animated decorative circles for the background
 */
export const AnimatedCircles: React.FC<AnimatedCirclesProps> = ({
  scaleAnim1,
  scaleAnim2,
  scaleAnim3,
}) => {
  return (
    <>
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          { transform: [{ scale: scaleAnim1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          { transform: [{ scale: scaleAnim2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          { transform: [{ scale: scaleAnim3 }] },
        ]}
      />
    </>
  );
};
