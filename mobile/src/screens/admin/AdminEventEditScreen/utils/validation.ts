import { Alert } from "react-native";

export interface EventFormData {
  title: string;
  location: string;
  description: string;
  price: string;
  minPrice: string;
  maxCapacity: string;
}

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

export const convertPriceToCents = (price: string): number => {
  return Math.round(parseFloat(price) * 100);
};

export const convertPriceToPounds = (
  cents: number | null | undefined
): string => {
  if (!cents) return "0";
  return (cents / 100).toFixed(2);
};
