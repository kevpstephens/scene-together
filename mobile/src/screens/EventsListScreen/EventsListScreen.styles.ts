import { StyleSheet, Platform } from "react-native";
import { theme } from "../../theme";
import { getPlatformGlow, getCardStyle } from "../../theme/styles";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  contentWrapper: {
    flex: 1,
    width: "100%",
    maxWidth: theme.layout.maxWidth,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center-align filter chips
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md, // More spacing before event list
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    marginHorizontal: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  list: {
    padding: theme.spacing.base,
    paddingTop: 0, // Header is now part of the list, no extra padding needed
  },
  emptyContainer: {
    flexGrow: 1,
    paddingTop: 0, // Header is now part of the list, no extra padding needed
    paddingBottom: 100,
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyIconContainer: {
    position: "relative",
    marginBottom: theme.spacing.xl,
  },
  emptyIconAccent: {
    position: "absolute",
    bottom: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.accent,
    opacity: 0.2,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    lineHeight: theme.typography.fontSize.base * 1.6,
    marginBottom: theme.spacing.xl,
  },
  emptyFeatures: {
    alignSelf: "center",
    flexDirection: "column",
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    paddingVertical:
      Platform.OS === "web" ? theme.spacing.xl : theme.spacing.lg,
    paddingHorizontal:
      Platform.OS === "web" ? theme.spacing.xxl : theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    minWidth: 280,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.12)",
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Platform.OS === "web" ? theme.spacing.lg : theme.spacing.md,
  },
  featureText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: Platform.OS === "web" ? theme.spacing.lg : theme.spacing.md,
    flex: 1,
  },
  card: {
    ...getCardStyle(),
    marginBottom: theme.spacing.lg,
    overflow: "hidden",
    borderRadius: 20, // Increased from default for more modern feel
    borderWidth: 1.5, // Slightly thicker border
    borderColor: `${theme.colors.primary}20`, // Subtle teal border (12.5% opacity)
    // Enhanced depth with glow
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: `0 4px 16px rgba(70, 212, 175, 0.1), 0 0 0 1px ${theme.colors.primary}20`,
      },
    }),
  },
  posterContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9, // Maintain movie poster aspect ratio (16:9)
    borderRadius: theme.components.radii.poster,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)", // Subtle white border
    ...getPlatformGlow("subtle"),
    // Inner shadow for depth
    ...Platform.select({
      web: {
        boxShadow:
          "inset 0 2px 8px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  poster: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.border,
  },
  posterGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "60%",
  },
  priceBadgeOnPoster: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
  },
  priceBadgeGradient: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    // Web-compatible shadow (subtle)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  priceTextOnPoster: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  statusBadge: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.12)",
        }
      : theme.shadows.md),
  },
  almostFullBadge: {
    backgroundColor: "#FF6B35", // Orange-red (90%+)
  },
  nearlyFullBadge: {
    backgroundColor: theme.colors.warning, // Orange (70-90%)
  },
  fillingUpBadge: {
    backgroundColor: "#FFC857", // Yellow (50-70%)
  },
  soldOutBadge: {
    backgroundColor: theme.colors.error, // Red (100%)
  },
  availableBadge: {
    backgroundColor: theme.colors.accent, // Teal (30-50%)
  },
  plentySpaceBadge: {
    backgroundColor: theme.colors.success, // Green (0-30%)
  },
  pastBadge: {
    backgroundColor: theme.colors.text.tertiary,
    opacity: 0.8,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginLeft: theme.spacing.xs,
  },
  cardContent: {
    paddingTop: theme.spacing.md, // Reduced to bring date badge closer to poster
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md, // Reduced to tighten bottom spacing
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  dateActionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  dateTag: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 2px 3px rgba(0, 0, 0, 0.08)",
        }
      : theme.shadows.sm),
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  iconButton: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.components.surfaces.section,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  iconButtonActive: {
    backgroundColor: `${theme.colors.warning}20`, // Subtle orange background
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.warning,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: `0px 2px 6px ${theme.colors.warning}40`,
      },
    }),
  },
  timeLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing.sm,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  dotSeparator: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginHorizontal: theme.spacing.sm,
  },
  dateTagText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  dateTagUrgent: {
    backgroundColor: theme.colors.warning, // Brighter orange for urgency
    borderWidth: 2,
    borderColor: `${theme.colors.warning}40`, // Subtle glow effect
    // Enhanced shadow for urgent dates
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.warning,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: `0px 4px 12px ${theme.colors.warning}60`,
      },
    }),
  },
  title: {
    fontSize: theme.typography.fontSize.xxl, // Increased from xl to xxl
    fontWeight: "800" as any, // Extra bold (800 weight)
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md, // Increased for better separation
    lineHeight: theme.typography.fontSize.xxl * 1.25, // Tighter line height for xxl
    letterSpacing: -0.5, // Slightly tighter letter spacing for impact
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm, // Increased from xs for better rhythm
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
  },
  location: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
    flexShrink: 1,
    marginLeft: theme.spacing.xs,
  },
  movieInfo: {
    marginTop: theme.spacing.sm, // Reduced for tighter spacing
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  movieTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  genreContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -theme.spacing.xxs,
  },
  genreChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)", // Subtle border for definition
    // Enhanced shadows for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow:
          "0px 3px 6px rgba(0, 0, 0, 0.25), 0px 1px 2px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  genreChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  capacityContainer: {
    marginTop: theme.spacing.lg, // Reduced for tighter spacing
  },
  capacityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  capacityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusBadgeInline: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    gap: 4,
  },
  statusTextInline: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  progressBarContainer: {
    height: 6, // Slightly taller for better visibility
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.full,
    overflow: "hidden",
    // Inner shadow for depth
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      web: {
        boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  progressBar: {
    height: "100%",
    borderRadius: theme.borderRadius.full,
    // Dynamic color is set inline based on percentage
    // Add subtle gradient overlay
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.15)",
      },
    }),
  },
  priceBadge: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  priceText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.5,
  },
});
