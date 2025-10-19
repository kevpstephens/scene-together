import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.base,
    alignItems: "center",
  },
  welcomeBox: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    backgroundColor: "rgba(255, 255, 255, 0.08)", // Slightly transparent
    borderRadius: theme.borderRadius.xl,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    borderWidth: 1.5,
    borderColor: `${theme.colors.primary}40`, // Teal outline with transparency
    overflow: "hidden", // Important for blur effect
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        padding: theme.spacing.xl,
        boxShadow: `0 4px 16px ${theme.colors.primary}20, 0 2px 8px rgba(0, 0, 0, 0.1)`,
        backdropFilter: "blur(10px)",
      },
    }),
  },
  blurContainer: {
    padding: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
  },
  statsContainer: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  statsGrid: {
    width: "100%",
    height: 180,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  statCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      },
    }),
  },
  leftCircle: {
    left: Platform.OS === "web" ? 20 : 0,
    zIndex: 1,
  },
  centerCircle: {
    left: "50%",
    marginLeft: -70, // Half of width to center
    zIndex: 3, // Highest z-index for center circle (like logo)
  },
  rightCircle: {
    right: Platform.OS === "web" ? 20 : 0,
    zIndex: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#fff",
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: "#fff",
    opacity: 0.95,
    lineHeight: 14,
    textAlign: "center",
  },
  section: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  actionCard: {
    backgroundColor: theme.components.surfaces.card,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: theme.components.borders.default,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: `${theme.colors.primary}20`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.base,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  actionDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  infoBanner: {
    width: "100%",
    maxWidth: theme.layout.maxWidth,
    backgroundColor: "#FFF4E6",
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.base,
    borderWidth: 1,
    borderColor: "#FFD700",
    flexDirection: "row",
    alignItems: "center",
  },
  infoBannerText: {
    fontSize: theme.typography.fontSize.sm,
    color: "#B8860B",
    textAlign: "center",
  },
  infoBold: {
    fontWeight: theme.typography.fontWeight.bold,
  },
});
