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
  filmReelContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  sprocketHole: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Dark holes for depth
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)", // Subtle highlight
  },
});
