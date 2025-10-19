import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../AdminDashboardScreen.styles";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  description,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <View style={styles.actionIconContainer}>{icon}</View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};
