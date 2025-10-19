import React from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../theme";

interface PosterPlaceholderProps {
  title?: string;
  style?: any;
  iconSize?: number;
}

/**
 * Placeholder component for missing or broken movie posters
 * Shows a subtle gradient with the SceneTogether logo
 */
export default function PosterPlaceholder({
  title,
  style,
  iconSize = 80,
}: PosterPlaceholderProps) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={[
          "rgba(70, 212, 175, 0.2)",
          "rgba(70, 212, 175, 0.6)",
          "rgba(10, 15, 20, 0.8)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image
            source={require("../../assets/logo/logo-transparent.png")}
            style={[styles.logo, { width: iconSize, height: iconSize }]}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text style={styles.text}>
              {title ? `${title}` : "No Poster Available"}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  logo: {
    opacity: 1,
    marginBottom: theme.spacing.xxs,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  text: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: "center",
    maxWidth: "80%",
  },
});
