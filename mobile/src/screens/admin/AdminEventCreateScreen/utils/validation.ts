/*===============================================
 * Validation Utilities - AdminEventCreateScreen
 * ==============================================
 * Form validation and price conversion helpers.
 * ==============================================
 */

import { Alert } from "react-native";

export interface EventFormData {
  title: string;
  location: string;
  description: string;
  price: string;
  minPrice: string;
  maxCapacity: string;
}

/**
 * Validate event form data
 * Shows alert for validation errors
 * @param data - Event form data
 * @returns True if valid, false otherwise
 */
export const validateEventForm = (data: EventFormData): boolean => {
  if (!data.title.trim()) {
    Alert.alert("Validation Error", "Please enter an event title");
    return false;
  }

  if (!data.location.trim()) {
    Alert.alert("Validation Error", "Please enter a location");
    return false;
  }

  if (!data.description.trim()) {
    Alert.alert("Validation Error", "Please enter an event description");
    return false;
  }

  return true;
};

/**
 * Convert price from pounds to cents
 * @param price - Price in pounds (string)
 * @returns Price in cents (number)
 */
export const convertPriceToCents = (price: string): number => {
  return Math.round(parseFloat(price) * 100);
};

/**
 * Convert price from cents to pounds
 * @param cents - Price in cents
 * @returns Price in pounds (string)
 */
export const convertPriceToPounds = (
  cents: number | null | undefined
): string => {
  if (!cents) return "0";
  return (cents / 100).toFixed(2);
};
