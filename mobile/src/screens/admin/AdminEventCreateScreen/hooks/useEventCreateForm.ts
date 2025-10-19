import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../navigation/types";
import { api } from "../../../../services/api";
import { validateEventForm, convertPriceToCents } from "../utils";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEventCreate"
>;

export interface EventCreateFormState {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  maxCapacity: string;
  price: string;
  payWhatYouCan: boolean;
  minPrice: string;
  tmdbId: number | undefined;
}

export interface UseEventCreateFormReturn {
  submitting: boolean;
  formState: EventCreateFormState;

  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setEventDate: (value: Date) => void;
  setLocation: (value: string) => void;
  setMaxCapacity: (value: string) => void;
  setPrice: (value: string) => void;
  setPayWhatYouCan: (value: boolean) => void;
  setMinPrice: (value: string) => void;
  setTmdbId: (value: number | undefined) => void;

  handleSubmit: () => Promise<void>;
}

export const useEventCreateForm = (): UseEventCreateFormReturn => {
  const navigation = useNavigation<NavigationProp>();
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("50");
  const [price, setPrice] = useState("0");
  const [payWhatYouCan, setPayWhatYouCan] = useState(false);
  const [minPrice, setMinPrice] = useState("0");
  const [tmdbId, setTmdbId] = useState<number | undefined>();

  const handleSubmit = async () => {
    // Validation
    if (
      !validateEventForm({
        title,
        location,
        description,
        price,
        minPrice,
        maxCapacity,
      })
    ) {
      return;
    }

    setSubmitting(true);

    try {
      // Convert prices from pounds to cents for storage
      const priceInCents = convertPriceToCents(price);
      const minPriceInCents = minPrice ? convertPriceToCents(minPrice) : null;

      // Fetch movie details if a movie was selected
      let movieData = null;
      if (tmdbId) {
        try {
          const { data } = await api.get(`/movies/${tmdbId}`);
          movieData = data;
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
          // Continue without movie data
        }
      }

      const createPayload: any = {
        title,
        description,
        date: eventDate.toISOString(),
        location,
        maxCapacity: parseInt(maxCapacity),
        price: priceInCents || null,
        payWhatYouCan: payWhatYouCan || false,
        minPrice: minPriceInCents || null,
      };

      // Only include movieData if we have it
      if (movieData) {
        createPayload.movieData = movieData;
      }

      await api.post("/events", createPayload);

      Alert.alert("Success", "Event created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Failed to create event:", error);
      const errorMsg = error.response?.data?.error || "Failed to create event";
      Alert.alert("Error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    formState: {
      title,
      description,
      eventDate,
      location,
      maxCapacity,
      price,
      payWhatYouCan,
      minPrice,
      tmdbId,
    },
    setTitle,
    setDescription,
    setEventDate,
    setLocation,
    setMaxCapacity,
    setPrice,
    setPayWhatYouCan,
    setMinPrice,
    setTmdbId,
    handleSubmit,
  };
};
