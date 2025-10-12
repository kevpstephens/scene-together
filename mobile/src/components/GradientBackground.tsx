import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

export default function GradientBackground() {
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
          duration: 8000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Breathing animation for circles - staggered
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim1, {
          toValue: 1.2,
          duration: 5000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim1, {
          toValue: 1,
          duration: 5000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim2, {
          toValue: 1.15,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim2, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim3, {
          toValue: 1.3,
          duration: 7000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim3, {
          toValue: 1,
          duration: 7000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      theme.colors.background,
      "#15191F", // Subtle darker tint with hint of teal
      theme.colors.background,
    ],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor }]}>
      <LinearGradient
        colors={[
          "rgba(70, 212, 175, 0.12)", // Turquoise with slightly higher opacity for dark mode
          "rgba(47, 169, 137, 0.08)", // Darker teal
          "transparent",
          "rgba(70, 212, 175, 0.10)",
        ]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      />

      {/* Animated decorative circles with breathing effect */}
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
    </Animated.View>
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
    opacity: 0.15, // Slightly more visible on dark background
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: theme.colors.primary,
    top: -200,
    right: -150,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: theme.colors.primaryDark,
    bottom: 50,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.accent,
    top: "35%",
    right: -100,
  },
});
