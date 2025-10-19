import React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

interface WebPickerProps {
  value: Date;
  mode: "date" | "time";
  minimumDate?: Date;
  onChange: (event: any, selectedDate?: Date) => void;
}

/**
 * Web-specific HTML5 date/time picker
 */
export const WebPicker: React.FC<WebPickerProps> = ({
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
