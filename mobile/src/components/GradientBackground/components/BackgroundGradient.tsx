import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../GradientBackground.styles";
import { gradientConfig } from "../config/gradients";

/**
 * LinearGradient overlay for the background
 */
export const BackgroundGradient: React.FC = () => {
  return (
    <LinearGradient
      colors={gradientConfig.colors}
      locations={gradientConfig.locations}
      style={styles.gradient}
      pointerEvents="none"
    />
  );
};
