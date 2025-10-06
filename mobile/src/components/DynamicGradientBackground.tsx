import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type DynamicGradientBackgroundProps = {
  primaryColor: string;
  secondaryColor: string;
  detailColor: string;
};

export default function DynamicGradientBackground({
  primaryColor,
  secondaryColor,
  detailColor,
}: DynamicGradientBackgroundProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Breathing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Color shift animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.08, 0.12, 0.08],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          `${primaryColor}15`,
          `${secondaryColor}10`,
          "transparent",
          `${detailColor}12`,
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      />

      {/* Animated decorative circles with extracted colors */}
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          {
            backgroundColor: primaryColor,
            opacity,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          {
            backgroundColor: secondaryColor,
            opacity: 0.08,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          {
            backgroundColor: detailColor,
            opacity: 0.1,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
  },
  circle1: {
    width: 400,
    height: 400,
    top: -200,
    right: -150,
  },
  circle2: {
    width: 300,
    height: 300,
    bottom: 50,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    top: "35%",
    right: -100,
  },
});

