import { StyleSheet } from "react-native";
import { theme } from "../../theme";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    overflow: "hidden",
  },
  standaloneContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  circle: {
    position: "absolute",
    borderRadius: 9999,
    opacity: 0.15,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: theme.colors.primary,
    top: -200,
    right: -150,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: theme.colors.primaryDark,
    bottom: 50,
    left: -100,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: theme.colors.accent,
    top: "35%",
    right: -100,
  },
});
