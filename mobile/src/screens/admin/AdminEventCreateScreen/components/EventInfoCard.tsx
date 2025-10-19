import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  TicketIcon,
} from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import DateTimePickerComponent from "../../../../components/DateTimePicker";
import { styles } from "../AdminEventCreateScreen.styles";

interface EventInfoCardProps {
  eventDate: Date;
  location: string;
  maxCapacity: string;
  price: string;
  minPrice: string;
  payWhatYouCan: boolean;
  onEventDateChange: (date: Date) => void;
  onLocationChange: (text: string) => void;
  onMaxCapacityChange: (text: string) => void;
  onPriceChange: (text: string) => void;
  onMinPriceChange: (text: string) => void;
  onTogglePWYC: () => void;
}

export const EventInfoCard: React.FC<EventInfoCardProps> = ({
  eventDate,
  location,
  maxCapacity,
  price,
  minPrice,
  payWhatYouCan,
  onEventDateChange,
  onLocationChange,
  onMaxCapacityChange,
  onPriceChange,
  onMinPriceChange,
  onTogglePWYC,
}) => {
  return (
    <View style={styles.infoCard}>
      {/* Date & Time */}
      <View style={styles.infoRowFull}>
        <View style={styles.dateTimeHeader}>
          <CalendarIcon size={20} color={theme.colors.primary} />
          <Text style={styles.infoLabel}>Date & Time</Text>
        </View>
        <DateTimePickerComponent
          value={eventDate}
          onChange={onEventDateChange}
        />
      </View>

      {/* Location - Editable */}
      <View style={styles.infoRow}>
        <MapPinIcon size={20} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Location</Text>
          <TextInput
            style={styles.infoValueInput}
            placeholder="Enter location"
            placeholderTextColor={theme.colors.text.tertiary}
            value={location}
            onChangeText={onLocationChange}
          />
        </View>
      </View>

      {/* Capacity - Editable */}
      <View style={styles.infoRow}>
        <UsersIcon size={20} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Capacity</Text>
          <TextInput
            style={styles.infoValueInput}
            placeholder="50"
            placeholderTextColor={theme.colors.text.tertiary}
            value={maxCapacity}
            onChangeText={onMaxCapacityChange}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Price - Editable */}
      <View style={styles.infoRow}>
        <TicketIcon size={20} color={theme.colors.primary} />
        <View style={styles.infoTextContainer}>
          <Text style={styles.infoLabel}>Price</Text>
          <View style={styles.priceInputContainer}>
            <TextInput
              style={[styles.infoValueInput, styles.priceInput]}
              placeholder="0.00"
              placeholderTextColor={theme.colors.text.tertiary}
              value={price}
              onChangeText={onPriceChange}
              keyboardType="decimal-pad"
            />
            {parseFloat(price) > 0 && (
              <TouchableOpacity
                style={styles.pywcToggle}
                onPress={onTogglePWYC}
              >
                <Text style={styles.pywcToggleText}>
                  {payWhatYouCan ? "✓ PWYC" : "PWYC?"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {payWhatYouCan && (
            <View style={styles.minPriceRow}>
              <Text style={styles.minPriceLabel}>Min Price: £</Text>
              <TextInput
                style={styles.minPriceInput}
                placeholder="0.00"
                placeholderTextColor={theme.colors.text.tertiary}
                value={minPrice}
                onChangeText={onMinPriceChange}
                keyboardType="decimal-pad"
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
