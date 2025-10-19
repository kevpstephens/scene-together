import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const styles = StyleSheet.create({
  //! ==============================================
  //! Tab Icon Container
  //! ==============================================
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  activeIndicator: {
    position: "absolute",
    top: -12,
    left: "10%",
    right: "10%",
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  //! ==============================================
  //! Profile Avatar Icon
  //! ==============================================
  profileAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.text.tertiary,
  },
  profileAvatarFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 2.5,
  },
});
