import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  PanResponder,
} from "react-native";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "react-native-heroicons/solid";
import { theme } from "../theme";

type ToastType = "success" | "error" | "info" | "warning";

type ToastProps = {
  message: string;
  type: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
};

export default function Toast({
  message,
  type,
  visible,
  onHide,
  duration = 3000,
}: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // Pan responder for swipe-to-dismiss (upwards)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gesture) => {
        // Only allow dragging upwards
        if (gesture.dy < 0) {
          translateY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_evt, gesture) => {
        const swipeUpEnough = gesture.dy < -40 || gesture.vy < -0.7;
        if (swipeUpEnough) {
          // Dismiss upwards
          Animated.timing(translateY, {
            toValue: -120,
            duration: 180,
            useNativeDriver: true,
          }).start(() => onHide());
        } else {
          // Snap back to visible
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 15,
            stiffness: 150,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 150,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const getIcon = () => {
    const iconSize = 24;
    const iconColor = "#ffffff";

    switch (type) {
      case "success":
        return <CheckCircleIcon size={iconSize} color={iconColor} />;
      case "error":
        return <XCircleIcon size={iconSize} color={iconColor} />;
      case "warning":
        return <ExclamationTriangleIcon size={iconSize} color={iconColor} />;
      case "info":
        return <InformationCircleIcon size={iconSize} color={iconColor} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return theme.colors.success;
      case "error":
        return theme.colors.error;
      case "warning":
        return theme.colors.warning;
      case "info":
        return theme.colors.info;
    }
  };

  // Wrap in overlay View (not Modal) so interactions pass through to content beneath
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.modalContainer} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: getBackgroundColor(),
              transform: [{ translateY }],
              opacity,
            },
          ]}
          pointerEvents="auto"
          {...panResponder.panHandlers}
        >
          {getIcon()}
          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999998,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: Platform.OS === "web" ? theme.spacing.base : 0,
  },
  container: {
    position: "absolute",
    top: 60,
    alignSelf: "center",
    maxWidth: Platform.OS === "web" ? 600 : "90%",
    minWidth: Platform.OS === "web" ? 300 : undefined,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    zIndex: 999999, // Extremely high z-index to appear above modals
    elevation: 999999, // Android elevation to appear above modals
    // Web-compatible shadow
    ...(Platform.OS === "web"
      ? {
          boxShadow: "0px 8px 12px rgba(0, 0, 0, 0.16)",
        }
      : theme.shadows.lg),
  },
  message: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.inverse,
    lineHeight: theme.typography.fontSize.base * 1.4,
  },
});
