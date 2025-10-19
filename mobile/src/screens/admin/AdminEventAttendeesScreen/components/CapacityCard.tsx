import React from "react";
import { View, Text } from "react-native";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventAttendeesScreen.styles";

interface CapacityCardProps {
  currentAttendees: number;
  capacity: number;
}

export const CapacityCard: React.FC<CapacityCardProps> = ({
  currentAttendees,
  capacity,
}) => {
  const fillPercentage = capacity ? (currentAttendees / capacity) * 100 : 0;

  const getProgressColor = () => {
    if (fillPercentage >= 90) return theme.colors.error;
    if (fillPercentage >= 70) return theme.colors.warning;
    return theme.colors.accent;
  };

  return (
    <View style={styles.capacityCard}>
      <View style={styles.capacityRow}>
        <Text style={styles.capacityLabel}>Capacity</Text>
        <Text style={styles.capacityValue}>
          {currentAttendees} / {capacity}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${fillPercentage}%`,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>
    </View>
  );
};
