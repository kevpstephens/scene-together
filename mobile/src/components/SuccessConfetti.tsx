import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { theme } from "../theme";

const { width, height } = Dimensions.get("window");

interface SuccessConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

interface ConfettiPiece {
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  opacity: Animated.Value;
  color: string;
  initialX: number;
}

const colors = [
  theme.colors.primary,
  theme.colors.accent,
  theme.colors.success,
  theme.colors.warning,
  "#FF6B9D",
  "#C44569",
  "#FFC312",
  "#12CBC4",
];

export default function SuccessConfetti({
  visible,
  onComplete,
}: SuccessConfettiProps) {
  const confettiPieces = useRef<ConfettiPiece[]>([]);

  useEffect(() => {
    if (visible) {
      // Create 30 confetti pieces
      confettiPieces.current = Array.from({ length: 30 }, () => {
        const initialX = Math.random() * width;
        return {
          x: new Animated.Value(initialX),
          y: new Animated.Value(-50),
          rotate: new Animated.Value(0),
          opacity: new Animated.Value(1),
          color: colors[Math.floor(Math.random() * colors.length)],
          initialX,
        };
      });

      // Animate each piece
      const animations = confettiPieces.current.map((piece) => {
        const randomX = (Math.random() - 0.5) * 200; // Random horizontal drift
        const randomRotation = Math.random() * 360 * 4; // Multiple rotations
        const fallDuration = 2500 + Math.random() * 1000; // Varied fall speed

        return Animated.parallel([
          Animated.timing(piece.y, {
            toValue: height + 50,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.x, {
            toValue: piece.initialX + randomX,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.rotate, {
            toValue: randomRotation,
            duration: fallDuration,
            useNativeDriver: true,
          }),
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration: fallDuration,
            delay: fallDuration * 0.7, // Start fading near the end
            useNativeDriver: true,
          }),
        ]);
      });

      // Run all animations
      Animated.parallel(animations).start(() => {
        if (onComplete) {
          onComplete();
        }
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {confettiPieces.current.map((piece, index) => (
        <Animated.View
          key={index}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                {
                  rotate: piece.rotate.interpolate({
                    inputRange: [0, 360],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
              opacity: piece.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    overflow: "hidden",
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});
