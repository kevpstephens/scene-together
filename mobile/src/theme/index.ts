/**
 * SceneTogether Theme
 * Centralized design tokens for consistent styling across the app
 */

export const theme = {
  colors: {
    // Primary brand colors - custom palette
    primary: "#46D4AF", // Turquoise (main brand color)
    primaryDark: "#23797E", // Teal (darker variant)
    primaryLight: "#6FE0C2", // Lighter turquoise

    // Accent colors for visual interest
    accent: "#46D4AF", // Turquoise (for highlights/CTAs)
    accentLight: "#6FE0C2", // Lighter turquoise

    // Backgrounds with more depth
    background: "#EFF0EF", // Anti-flash white (light gray)
    backgroundDark: "#23797E", // Teal for dark sections
    surface: "#ffffff", // White cards/surfaces
    surfaceElevated: "#ffffff", // White with shadows
    overlay: "rgba(0, 1, 2, 0.6)", // Black with opacity
    overlayLight: "rgba(0, 1, 2, 0.3)", // Black with lighter opacity

    // Gradient overlays
    gradientDark: "rgba(0, 1, 2, 0.7)", // Black gradient
    gradientPrimary: "rgba(70, 212, 175, 0.9)", // Turquoise with opacity

    // Text colors
    text: {
      primary: "#000102", // Black from palette
      secondary: "#23797E", // Teal from palette
      tertiary: "#a3a3a3", // Neutral 400 (keep for subtle text)
      inverse: "#ffffff", // White text
      accent: "#46D4AF", // Turquoise for highlights
    },

    // Status colors - more vibrant
    success: "#10b981", // Green 500
    warning: "#f59e0b", // Amber 500
    error: "#ef4444", // Red 500
    info: "#3b82f6", // Blue 500

    // Borders with subtle variations
    border: "#e5e5e5", // Neutral 200
    borderLight: "#f5f5f5", // Neutral 100
    borderDark: "#d4d4d4", // Neutral 300

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
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.16,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
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
