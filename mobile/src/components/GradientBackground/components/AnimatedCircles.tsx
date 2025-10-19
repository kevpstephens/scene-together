import React from "react";
import { Animated, View } from "react-native";
import { styles } from "../GradientBackground.styles";

interface AnimatedCirclesProps {
  scaleAnim1: Animated.Value;
  scaleAnim2: Animated.Value;
  scaleAnim3: Animated.Value;
}

/**
 * Film Reel Component - Creates a circle with sprocket holes like a film reel
 */
interface FilmReelProps {
  size: number;
  style?: any;
}

const FilmReel: React.FC<FilmReelProps> = ({ size, style }) => {
  const holeSize = size * 0.15; // Larger holes like real film reels
  const holeRadius = size * 0.35; // Distance from center

  // Create 3 large mounting holes (like actual film reels) positioned at 120° intervals
  const mountingHoles = Array.from({ length: 3 }, (_, i) => {
    const angle = (i * 120 * Math.PI) / 180; // 120 degrees apart (0°, 120°, 240°)
    const x = size / 2 + holeRadius * Math.cos(angle) - holeSize / 2;
    const y = size / 2 + holeRadius * Math.sin(angle) - holeSize / 2;

    return (
      <View
        key={`mounting-${i}`}
        style={[
          styles.sprocketHole,
          {
            width: holeSize,
            height: holeSize,
            borderRadius: holeSize / 2,
            left: x,
            top: y,
          },
        ]}
      />
    );
  });

  // Center hole (the axle hole)
  const centerHoleSize = holeSize * 0.5;
  const centerHole = (
    <View
      key="center"
      style={[
        styles.sprocketHole,
        {
          width: centerHoleSize,
          height: centerHoleSize,
          borderRadius: centerHoleSize / 2,
          left: size / 2 - centerHoleSize / 2,
          top: size / 2 - centerHoleSize / 2,
        },
      ]}
    />
  );

  return (
    <View style={style}>
      {mountingHoles}
      {centerHole}
    </View>
  );
};

/**
 * Animated decorative film reels for the background
 */
export const AnimatedCircles: React.FC<AnimatedCirclesProps> = ({
  scaleAnim1,
  scaleAnim2,
  scaleAnim3,
}) => {
  return (
    <>
      <Animated.View
        style={[
          styles.circle,
          styles.circle1,
          { transform: [{ scale: scaleAnim1 }] },
        ]}
      >
        <FilmReel size={400} style={styles.filmReelContainer} />
      </Animated.View>
      <Animated.View
        style={[
          styles.circle,
          styles.circle2,
          { transform: [{ scale: scaleAnim2 }] },
        ]}
      >
        <FilmReel size={300} style={styles.filmReelContainer} />
      </Animated.View>
      <Animated.View
        style={[
          styles.circle,
          styles.circle3,
          { transform: [{ scale: scaleAnim3 }] },
        ]}
      >
        <FilmReel size={200} style={styles.filmReelContainer} />
      </Animated.View>
    </>
  );
};
