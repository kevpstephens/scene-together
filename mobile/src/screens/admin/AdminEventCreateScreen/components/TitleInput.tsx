import React from "react";
import { View, TextInput } from "react-native";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventCreateScreen.styles";

interface TitleInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const TitleInput: React.FC<TitleInputProps> = ({
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.editableSection}>
      <TextInput
        style={styles.titleInput}
        placeholder="Event Title"
        placeholderTextColor={theme.colors.text.tertiary}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
    </View>
  );
};
