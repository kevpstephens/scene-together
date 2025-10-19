import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { CalendarIcon, ClockIcon } from "react-native-heroicons/outline";
import { theme } from "../../theme";
import { styles } from "./DateTimePicker.styles";
import { formatDate, formatTime } from "./utils/formatters";

interface DateTimePickerButtonsProps {
  value: Date;
  label?: string;
  onPressDate: () => void;
  onPressTime: () => void;
}

/**
 * Date and Time picker buttons that trigger platform-specific pickers
 */
export const DateTimePickerButtons: React.FC<DateTimePickerButtonsProps> = ({
  value,
  label,
  onPressDate,
  onPressTime,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.pickerRow}>
        {/* Date Picker Button */}
        <TouchableOpacity style={styles.pickerButton} onPress={onPressDate}>
          <CalendarIcon size={20} color={theme.colors.primary} />
          <Text style={styles.pickerText}>{formatDate(value)}</Text>
        </TouchableOpacity>

        {/* Time Picker Button */}
        <TouchableOpacity style={styles.pickerButton} onPress={onPressTime}>
          <ClockIcon size={20} color={theme.colors.primary} />
          <Text style={styles.pickerText}>{formatTime(value)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
