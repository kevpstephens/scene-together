/**
 * Mobile App Shared Styles
 * Uses the local theme from ./index
 *
 * Usage: import { styles, colors } from '@/theme/styles'
 */

import { StyleSheet } from "react-native";
import { theme } from "./index";

// Re-export theme colors and tokens for easy access
export const colors = theme.colors;
export const spacing = theme.spacing;
export const borderRadius = theme.borderRadius;
export const typography = theme.typography;
export const shadows = theme.shadows;

/**
 * Common reusable styles
 */
export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  containerCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  contentContainer: {
    padding: spacing.md,
  },

  // Card Styles
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },

  cardCompact: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    ...shadows.sm,
  },

  // Text Styles
  heading1: {
    fontSize: typography.fontSize.xxxl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    lineHeight: typography.fontSize.xxxl * typography.lineHeight.tight,
  },

  heading2: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text.primary,
    lineHeight: typography.fontSize.xxl * typography.lineHeight.tight,
  },

  heading3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text.primary,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  bodyText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.text.primary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  bodyTextSecondary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.text.secondary,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },

  // Button Styles
  buttonPrimary: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonPrimaryText: {
    color: "#FFFFFF",
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
  },

  buttonSecondary: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonSecondaryText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
  },

  // Input Styles
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },

  inputFocused: {
    borderColor: colors.accent,
    borderWidth: 2,
  },

  // Badge Styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold as any,
  },

  // Status Badge Colors (using info, success, warning)
  badgeSuccess: {
    backgroundColor: "rgba(52, 211, 153, 0.2)", // success with 20% opacity
  },

  badgeSuccessText: {
    color: colors.success,
  },

  badgeInfo: {
    backgroundColor: "rgba(96, 165, 250, 0.2)", // info with 20% opacity
  },

  badgeInfoText: {
    color: colors.info,
  },

  badgeWarning: {
    backgroundColor: "rgba(251, 191, 36, 0.2)", // warning with 20% opacity
  },

  badgeWarningText: {
    color: colors.warning,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },

  // Loading / Empty States
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xl,
  },

  emptyStateText: {
    fontSize: typography.fontSize.lg,
    color: colors.text.secondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
});

/**
 * Helper function to create consistent shadows
 */
export const getShadow = (size: "sm" | "md" | "lg" | "xl" = "md") => {
  return shadows[size];
};

/**
 * Helper function to get consistent spacing
 */
export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size];
};

/**
 * Platform-specific helper for applying glow effects
 * Usage: ...getPlatformGlow('subtle')
 */
export const getPlatformGlow = (
  intensity: "subtle" | "strong" = "subtle"
): any => {
  const { Platform } = require("react-native");
  const glow = theme.components.glows[intensity];

  if (Platform.OS === "web") {
    return { boxShadow: glow.web };
  }
  return glow.native;
};

/**
 * Helper to create card styles with semi-transparent background
 * Usage: ...getCardStyle() or ...getCardStyle('elevated')
 */
export const getCardStyle = (variant: "card" | "cardElevated" = "card") => {
  return {
    backgroundColor: theme.components.surfaces[variant],
    borderRadius: theme.components.radii.card,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    padding: spacing.md,
  };
};

/**
 * Helper to create poster/image wrapper with glow
 * Usage: ...getPosterWrapperStyle({ width: '85%', intensity: 'strong' })
 */
export const getPosterWrapperStyle = (
  options: {
    width?: string | number;
    intensity?: "subtle" | "strong";
  } = {}
) => {
  const { Platform } = require("react-native");
  const { width = "100%", intensity = "strong" } = options;

  return {
    width,
    aspectRatio: 2 / 3,
    alignSelf: "center" as const,
    borderRadius: theme.components.radii.poster,
    ...getPlatformGlow(intensity),
  };
};

/**
 * Helper to create section styles (lighter transparent backgrounds within cards)
 * Usage: ...getSectionStyle()
 */
export const getSectionStyle = () => {
  return {
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.components.borders.subtle,
    padding: spacing.md,
  };
};
