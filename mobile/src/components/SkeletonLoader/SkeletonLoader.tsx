import React from "react";
import { View, Animated, ViewStyle } from "react-native";
import { theme } from "../../theme";
import { styles } from "./SkeletonLoader.styles";
import { useShimmerAnimation } from "./hooks/useShimmerAnimation";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Base skeleton loader component with shimmer animation
 */
export default function SkeletonLoader({
  width = "100%",
  height = 20,
  borderRadius = theme.borderRadius.md,
  style,
}: SkeletonLoaderProps) {
  const { opacity } = useShimmerAnimation();

  return (
    <View
      style={[
        styles.container,
        { width, height, borderRadius } as ViewStyle,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.shimmer,
          {
            opacity,
            borderRadius,
          },
        ]}
      />
    </View>
  );
}
