import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../../theme";
import { styles } from "./DateTimePicker.styles";

interface IOSPickerModalProps {
  visible: boolean;
  value: Date;
  mode: "date" | "time";
  minimumDate?: Date;
  onClose: () => void;
  onChange: (event: any, selectedDate?: Date) => void;
}

/**
 * iOS-specific modal date/time picker with native spinner
 */
export const IOSPickerModal: React.FC<IOSPickerModalProps> = ({
  visible,
  value,
  mode,
  minimumDate,
  onClose,
  onChange,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalButton}>Done</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={value}
            mode={mode}
            display="spinner"
            onChange={onChange}
            minimumDate={mode === "date" ? minimumDate : undefined}
            textColor={theme.colors.text.primary}
          />
        </View>
      </View>
    </Modal>
  );
};
