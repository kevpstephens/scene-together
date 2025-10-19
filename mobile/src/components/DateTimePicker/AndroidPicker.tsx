import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AndroidPickerProps {
  value: Date;
  mode: "date" | "time";
  minimumDate?: Date;
  onChange: (event: any, selectedDate?: Date) => void;
}

/**
 * Android-specific native date/time picker
 */
export const AndroidPicker: React.FC<AndroidPickerProps> = ({
  value,
  mode,
  minimumDate,
  onChange,
}) => {
  return (
    <DateTimePicker
      value={value}
      mode={mode}
      display="default"
      onChange={onChange}
      minimumDate={mode === "date" ? minimumDate : undefined}
    />
  );
};
