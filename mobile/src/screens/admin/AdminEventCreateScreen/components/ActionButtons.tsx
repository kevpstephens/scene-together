import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AnimatedButton from "../../../../components/AnimatedButton";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventCreateScreen.styles";

interface ActionButtonsProps {
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  submitButtonText?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  submitting,
  onSubmit,
  onCancel,
  submitButtonText = "Save Changes",
}) => {
  return (
    <View style={styles.actionButtons}>
      <AnimatedButton
        style={styles.createButton}
        onPress={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color={theme.colors.text.inverse} />
        ) : (
          <Text style={styles.createButtonText}>{submitButtonText}</Text>
        )}
      </AnimatedButton>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={onCancel}
        disabled={submitting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};
