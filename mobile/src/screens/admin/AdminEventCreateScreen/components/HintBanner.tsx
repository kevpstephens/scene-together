import React from "react";
import { View, Text } from "react-native";
import { PencilIcon } from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventCreateScreen.styles";

interface HintBannerProps {
  hintText?: string;
}

export const HintBanner: React.FC<HintBannerProps> = ({
  hintText = "Tap sections to edit • Updating your event listing",
}) => {
  return (
    <View style={styles.hintBanner}>
      <PencilIcon size={16} color={theme.colors.primary} />
      <Text style={styles.hintText}>{hintText}</Text>
    </View>
  );
};
