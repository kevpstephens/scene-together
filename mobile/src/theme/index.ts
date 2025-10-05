/**
 * SceneTogether Theme
 * Centralized design tokens for consistent styling across the app
 */

export const theme = {
  colors: {
    // Primary brand color
    primary: "#23797E", // Teal
    primaryDark: "#4f46e5",
    primaryLight: "#818cf8",

    // Backgrounds
    background: "#f9fafb", // Light gray
    surface: "#ffffff", // White cards/surfaces
    overlay: "rgba(0, 0, 0, 0.5)",

    // Text colors
    text: {
      primary: "#111827", // Almost black
      secondary: "#6b7280", // Medium gray
      tertiary: "#9ca3af", // Light gray
      inverse: "#ffffff", // White text
    },

    // Status colors
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    info: "#3b82f6",

    // Borders
    border: "#e5e7eb",
    borderLight: "#f3f4f6",

    // Transparent variations
    transparent: "transparent",
  },

  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  typography: {
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
      giant: 64,
      emoji: 80,
    },

    // Font weights
    fontWeight: {
      normal: "400" as const,
      medium: "500" as const,
      semibold: "600" as const,
      bold: "700" as const,
    },

    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  shadows: {
    sm: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
  },

  // Common measurements
  layout: {
    tabBarHeight: 60,
    headerHeight: 56,
    maxWidth: 600, // Max width for content on tablets
  },
} as const;

// Type for theme colors (useful for TypeScript autocomplete)
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
