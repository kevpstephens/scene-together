/**
 * SceneTogether Theme
 * Centralized design tokens for consistent styling across the app
 */

export const theme = {
  colors: {
    // Primary brand colors - Teal/Turquoise accent
    primary: "#46D4AF", // Turquoise (main brand color)
    primaryDark: "#2FA989", // Darker teal
    primaryLight: "#6FE0C2", // Lighter turquoise

    // Accent colors for visual interest
    accent: "#46D4AF", // Turquoise (for highlights/CTAs)
    accentLight: "#6FE0C2", // Lighter turquoise

    // Dark theme backgrounds
    background: "#0F1419", // Very dark blue-gray (almost black)
    backgroundDark: "#0A0E13", // Even darker for depth
    surface: "#1A1F26", // Dark gray-blue for cards/surfaces
    surfaceElevated: "#1F252E", // Slightly lighter for elevated elements
    overlay: "rgba(0, 0, 0, 0.8)", // Dark overlay
    overlayLight: "rgba(0, 0, 0, 0.5)", // Lighter dark overlay

    // Gradient overlays
    gradientDark: "rgba(15, 20, 25, 0.95)", // Dark gradient
    gradientPrimary: "rgba(70, 212, 175, 0.85)", // Turquoise with opacity

    // Text colors for dark theme
    text: {
      primary: "#E8EAED", // Light gray (high contrast on dark)
      secondary: "#9BA1A6", // Medium gray (secondary text)
      tertiary: "#6B7280", // Darker gray (subtle text)
      inverse: "#0F1419", // Dark text (for light backgrounds)
      accent: "#46D4AF", // Turquoise for highlights
    },

    // Status colors - adjusted for dark theme
    success: "#34D399", // Brighter green
    warning: "#FBBF24", // Brighter amber
    error: "#F87171", // Brighter red
    info: "#60A5FA", // Brighter blue

    // Borders for dark theme
    border: "#2D3748", // Dark border
    borderLight: "#1F252E", // Very subtle border
    borderDark: "#3D4753", // More visible border

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
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 20,
      elevation: 15,
    },
  },

  // Animation timings
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: "ease-in-out",
      easeIn: "ease-in",
      easeOut: "ease-out",
      linear: "linear",
    },
  },

  // Common measurements
  layout: {
    tabBarHeight: 80,
    headerHeight: 56,
    maxWidth: 600, // Max width for content on tablets
  },
} as const;

// Type for theme colors (useful for TypeScript autocomplete)
export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
