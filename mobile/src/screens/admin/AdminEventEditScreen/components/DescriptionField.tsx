import React from "react";
import { View, Text, TextInput } from "react-native";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventEditScreen.styles";

interface DescriptionFieldProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>About This Event</Text>
      <TextInput
        style={styles.descriptionInput}
        placeholder="Describe your event..."
        placeholderTextColor={theme.colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />
    </View>
  );
};
