import React from "react";
import { TouchableOpacity } from "react-native";
import { PlusIcon } from "react-native-heroicons/solid";
import { styles } from "../AdminEventsScreen.styles";

interface FloatingActionButtonProps {
  onPress: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
      <PlusIcon size={28} color="#fff" />
    </TouchableOpacity>
  );
};
