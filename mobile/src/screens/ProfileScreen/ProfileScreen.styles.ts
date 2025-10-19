import { StyleSheet, Platform } from "react-native";
import { theme } from "../../theme";
import { getCardStyle } from "../../theme/styles";

export const styles = StyleSheet.create({
  //! ==============================================
  //! Layout & Container Styles
  //! ==============================================
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    maxWidth: theme.layout.maxWidth,
    width: "100%",
    alignSelf: "center",
  },

  //! ==============================================
  //! Profile Card & Avatar
  //! ==============================================
  profileCard: {
    ...getCardStyle(),
    alignItems: "center",
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.base,
  },
  avatarText: {
    fontSize: theme.typography.fontSize.display,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  name: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.base,
  },
  editButtonTopRight: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  roleBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  roleText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  joinedText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },

  //! ==============================================
  //! Events Section
  //! ==============================================
  eventsCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyIconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${theme.colors.primary}15`,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.base,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
    lineHeight: 22,
  },
  emptyActionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 4px 12px rgba(70, 212, 175, 0.3)",
      },
    }),
  },
  emptyActionText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  placeholder: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: theme.spacing.sm,
  },
  eventMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },

  //! ==============================================
  //! Loading States
  //! ==============================================
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  loadingSmallText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },

  //! ==============================================
  //! Event Card Display
  //! ==============================================
  eventCard: {
    flexDirection: "row",
    backgroundColor: theme.components.surfaces.section,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.components.borders.subtle,
    marginBottom: theme.spacing.md,
    overflow: "hidden",
    minHeight: 120,
  },
  eventPoster: {
    width: 80,
    height: "100%",
  },
  eventInfo: {
    flex: 1,
    padding: theme.spacing.md,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  eventDate: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  eventLocation: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusGoing: {
    backgroundColor: "#10B981", // Green
  },
  statusInterested: {
    backgroundColor: "#F59E0B", // Orange
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },

  //! ==============================================
  //! Statistics Card
  //! ==============================================
  statsCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    width: "100%",
    height: 130,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  statCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: "0 3px 10px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  leftCircle: {
    left: Platform.OS === "web" ? 30 : 15,
    zIndex: 1,
  },
  centerCircle: {
    left: "50%",
    marginLeft: -50, // Half of width to center
    zIndex: 3, // Highest z-index for center circle
  },
  rightCircle: {
    right: Platform.OS === "web" ? 30 : 15,
    zIndex: 2,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: "#fff",
    marginTop: theme.spacing.xxs,
  },
  statLabel: {
    fontSize: 10,
    color: "#fff",
    opacity: 0.95,
    textAlign: "center",
    lineHeight: 12,
  },

  //! ==============================================
  //! Recent Activity Section
  //! ==============================================
  recentActivity: {
    backgroundColor: theme.components.surfaces.section,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.primary,
    marginBottom: theme.spacing.base,
  },
  recentActivityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  recentActivityTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  recentActivityText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xxs,
  },
  recentActivityEvent: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  recentActivityDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },

  //! ==============================================
  //! Favorite Genres Section
  //! ==============================================
  favoriteGenres: {
    paddingTop: theme.spacing.base,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  favoriteGenresTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  genreChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -theme.spacing.xxs,
  },
  genreChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: theme.spacing.xxs,
    marginBottom: theme.spacing.xs,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
      },
    }),
  },
  genreChipText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
  },

  //! ==============================================
  //! Filter Buttons
  //! ==============================================
  filterContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    flexWrap: "wrap",
  },
  filterButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.components.surfaces.section,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  filterButtonTextActive: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.bold,
  },

  //! ==============================================
  //! Payment History Section
  //! ==============================================
  paymentHistoryCard: {
    ...getCardStyle(),
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xxs,
    marginBottom: theme.spacing.base,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  paymentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.components.surfaces.section,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  paymentDetails: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  paymentEventTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  paymentDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  paymentAmountContainer: {
    alignItems: "flex-end",
  },
  paymentAmount: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xxs,
  },
  paymentStatusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
  },
  paymentStatusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  paymentHistoryFooter: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
    textAlign: "center",
    marginTop: theme.spacing.base,
    fontStyle: "italic",
  },
});
