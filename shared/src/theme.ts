/**
 * SceneTogether Design System
 * Shared theme tokens for mobile and web applications
 *
 * Usage:
 * - Mobile: import { theme } from '../../../shared/src/theme'
 * - Web: import { theme } from '../../../shared/src/theme'
 * - Or re-export from @/lib/constants (web) or @/theme/styles (mobile)
 */

export const theme = {
  colors: {
    // Primary Brand Colors
    primary: "#8113d5", // Purple (main brand)
    accent: "#46D4AF", // Teal/Turquoise (CTAs, highlights)
    accentHover: "#3BC19E", // Darker teal for hover states

    // Neutrals
    background: "#FFFFFF",
    backgroundAlt: "#F9FAFB", // Light gray for cards/sections
    text: "#000102", // Almost black
    textSecondary: "#6B7280", // Gray text
    textTertiary: "#9CA3AF", // Lighter gray

    // Semantic Colors
    success: "#10B981", // Green
    warning: "#F59E0B", // Orange
    error: "#EF4444", // Red
    info: "#3B82F6", // Blue

    // UI Elements
    border: "#E5E7EB", // Light border
    borderHover: "#46D4AF", // Accent border on hover
    inputBackground: "#FFFFFF",

    // Status Colors (for events)
    upcoming: "#3B82F6",
    ongoing: "#10B981",
    past: "#6B7280",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  typography: {
    // Font Families
    fonts: {
      heading: "System", // Platform default
      body: "System", // Platform default
    },

    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      "2xl": 24,
      "3xl": 30,
      "4xl": 36,
    },

    // Font Weights
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },

    // Line Heights
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
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 8,
    },
  },

  animation: {
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    easing: {
      default: "ease-in-out",
      spring: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
  },
} as const;

// Type exports for TypeScript autocomplete
export type Theme = typeof theme;
export type ThemeColors = keyof typeof theme.colors;
export type ThemeSpacing = keyof typeof theme.spacing;
export type ThemeBorderRadius = keyof typeof theme.borderRadius;
