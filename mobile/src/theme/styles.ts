/**
 * Mobile App Shared Styles
 * Uses the shared design system theme from ../../../shared/src/theme
 *
 * Usage: import { styles, colors } from '@/theme/styles'
 */

import { StyleSheet } from "react-native";
import { theme } from "../../../shared/src/theme";

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
    fontSize: typography.fontSize["3xl"],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    lineHeight: typography.fontSize["3xl"] * typography.lineHeight.tight,
  },

  heading2: {
    fontSize: typography.fontSize["2xl"],
    fontWeight: typography.fontWeight.bold as any,
    color: colors.text,
    lineHeight: typography.fontSize["2xl"] * typography.lineHeight.tight,
  },

  heading3: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold as any,
    color: colors.text,
    lineHeight: typography.fontSize.xl * typography.lineHeight.normal,
  },

  bodyText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.text,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  bodyTextSecondary: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * typography.lineHeight.normal,
  },

  caption: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal as any,
    color: colors.textSecondary,
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
    color: colors.text,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold as any,
  },

  // Input Styles
  input: {
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.fontSize.base,
    color: colors.text,
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

  // Status Badge Colors
  badgeUpcoming: {
    backgroundColor: `${colors.upcoming}20`, // 20% opacity
  },

  badgeUpcomingText: {
    color: colors.upcoming,
  },

  badgeOngoing: {
    backgroundColor: `${colors.ongoing}20`,
  },

  badgeOngoingText: {
    color: colors.ongoing,
  },

  badgePast: {
    backgroundColor: `${colors.past}20`,
  },

  badgePastText: {
    color: colors.past,
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
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
});

/**
 * Helper function to create consistent shadows
 */
export const getShadow = (size: "sm" | "md" | "lg" = "md") => {
  return shadows[size];
};

/**
 * Helper function to get consistent spacing
 */
export const getSpacing = (size: keyof typeof spacing) => {
  return spacing[size];
};
