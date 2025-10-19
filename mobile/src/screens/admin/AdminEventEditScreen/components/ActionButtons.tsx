import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import AnimatedButton from "../../../../components/AnimatedButton";
import { theme } from "../../../../theme";
import { styles } from "../AdminEventEditScreen.styles";

interface ActionButtonsProps {
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  submitting,
  onSubmit,
  onCancel,
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
          <Text style={styles.createButtonText}>Save Changes</Text>
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
