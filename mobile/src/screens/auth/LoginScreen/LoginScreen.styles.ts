import { StyleSheet, Platform } from "react-native";
import { theme } from "../../../theme";

export const styles = StyleSheet.create({
  //! ==============================================
  //! Layout & Container Styles
  //! ==============================================
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },

  //! ==============================================
  //! Logo & Branding
  //! ==============================================
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.25)", // Bright frosted glass - makes logo pop
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md, // More padding around logo
    marginBottom: theme.spacing.lg, // More breathing room after logo
    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.35)", // Light border for clean separation
    // Shadow with teal glow
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary, // Teal glow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow:
          "0 4px 16px rgba(70, 212, 175, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)",
      },
    }),
  },
  logo: {
    width: 230, // Larger, more prominent
    height: 125,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg, // More breathing room
  },

  //! ==============================================
  //! Form Inputs
  //! ==============================================
  form: {
    width: "100%",
    maxWidth: 400,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
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
  inputContainerFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: "0 0 12px rgba(70, 212, 175, 0.4)",
      },
    }),
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  passwordToggle: {
    padding: theme.spacing.xs,
  },

  //! ==============================================
  //! Buttons & Actions
  //! ==============================================
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md, // Comfortable size
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.md, // Better spacing
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: "center",
  },
  linkButton: {
    marginTop: theme.spacing.base, // Good spacing
  },
  linkText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  linkTextBold: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },

  //! ==============================================
  //! Divider & OAuth Section
  //! ==============================================
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.base, // Good spacing
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.base,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)" }
      : theme.shadows.sm),
  },
  googleIcon: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginRight: theme.spacing.sm,
    color: theme.colors.primary,
  },
  googleButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  demoBanner: {
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg, // More breathing room before form
    width: "100%",
    maxWidth: 400,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 2px 4px rgba(70, 212, 175, 0.3)" }
      : theme.shadows.sm),
  },
  demoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  demoIcon: {
    marginRight: theme.spacing.xs,
  },
  demoTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  infoButton: {
    padding: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  modalContent: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: "0 8px 32px rgba(70, 212, 175, 0.4)",
      },
    }),
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  modalIcon: {
    marginRight: theme.spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  modalCloseButton: {
    padding: theme.spacing.xs,
  },
  modalText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  modalBold: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  modalList: {
    marginTop: theme.spacing.sm,
    paddingLeft: theme.spacing.sm,
  },
  modalListItem: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    lineHeight: 24,
    marginBottom: theme.spacing.xs,
  },
  demoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  demoLabel: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  demoButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
    alignItems: "center",
  },
  demoButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
