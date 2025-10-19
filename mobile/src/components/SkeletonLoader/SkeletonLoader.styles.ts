import { StyleSheet, Platform } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.border,
    overflow: "hidden",
  },
  shimmer: {
    width: "100%",
    height: "100%",
    backgroundColor: theme.colors.borderLight,
  },
  eventCardSkeleton: {
    flexDirection: "row",
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.base,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  posterSkeleton: {
    marginRight: theme.spacing.md,
  },
  eventInfoSkeleton: {
    flex: 1,
    justifyContent: "center",
  },
  statCardSkeleton: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.lg,
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.lg,
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      },
    }),
  },
  profileHeaderSkeleton: {
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  mb8: {
    marginBottom: 8,
  },
  mb12: {
    marginBottom: 12,
  },
  mb16: {
    marginBottom: 16,
  },
});
