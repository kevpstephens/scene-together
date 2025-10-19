import React, { useState } from "react";
import { Platform } from "react-native";
import { DateTimePickerButtons } from "./DateTimePickerButtons";
import { IOSPickerModal } from "./IOSPickerModal";
import { AndroidPicker } from "./AndroidPicker";
import { WebPicker } from "./WebPicker";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
  minimumDate?: Date;
}

/**
 * Cross-platform date and time picker component
 * Handles iOS modal, Android native, and Web HTML5 pickers
 */
export default function DateTimePickerComponent({
  value,
  onChange,
  label,
  minimumDate,
}: DateTimePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      // Merge the time with the current date
      const newDate = new Date(value);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      onChange(newDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const showTimePickerModal = () => {
    setShowTimePicker(true);
  };

  return (
    <>
      <DateTimePickerButtons
        value={value}
        label={label}
        onPressDate={showDatePickerModal}
        onPressTime={showTimePickerModal}
      />

      {/* iOS Pickers */}
      {Platform.OS === "ios" && showDatePicker && (
        <IOSPickerModal
          visible={showDatePicker}
          value={value}
          mode="date"
          minimumDate={minimumDate}
          onClose={() => setShowDatePicker(false)}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === "ios" && showTimePicker && (
        <IOSPickerModal
          visible={showTimePicker}
          value={value}
          mode="time"
          onClose={() => setShowTimePicker(false)}
          onChange={handleTimeChange}
        />
      )}

      {/* Android Pickers */}
      {Platform.OS === "android" && showDatePicker && (
        <AndroidPicker
          value={value}
          mode="date"
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === "android" && showTimePicker && (
        <AndroidPicker value={value} mode="time" onChange={handleTimeChange} />
      )}

      {/* Web Pickers */}
      {Platform.OS === "web" && showDatePicker && (
        <WebPicker
          value={value}
          mode="date"
          minimumDate={minimumDate}
          onChange={handleDateChange}
        />
      )}

      {Platform.OS === "web" && showTimePicker && (
        <WebPicker value={value} mode="time" onChange={handleTimeChange} />
      )}
    </>
  );
}
