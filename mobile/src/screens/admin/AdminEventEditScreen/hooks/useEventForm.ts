import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AdminStackParamList } from "../../../../navigation/types";
import { api } from "../../../../services/api";
import {
  validateEventForm,
  convertPriceToCents,
  convertPriceToPounds,
} from "../utils";

type NavigationProp = NativeStackNavigationProp<
  AdminStackParamList,
  "AdminEventEdit"
>;

interface UseEventFormProps {
  eventId: string;
}

export interface EventFormState {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  maxCapacity: string;
  price: string;
  payWhatYouCan: boolean;
  minPrice: string;
  tmdbId: number | undefined;
  existingMovieData: any;
}

export interface UseEventFormReturn {
  // State
  loading: boolean;
  submitting: boolean;
  formState: EventFormState;

  // Setters
  setTitle: (value: string) => void;
  setDescription: (value: string) => void;
  setEventDate: (value: Date) => void;
  setLocation: (value: string) => void;
  setMaxCapacity: (value: string) => void;
  setPrice: (value: string) => void;
  setPayWhatYouCan: (value: boolean) => void;
  setMinPrice: (value: string) => void;
  setTmdbId: (value: number | undefined) => void;
  setExistingMovieData: (value: any) => void;

  // Actions
  handleSubmit: () => Promise<void>;
  loadEvent: () => Promise<void>;
}

export const useEventForm = ({
  eventId,
}: UseEventFormProps): UseEventFormReturn => {
  const navigation = useNavigation<NavigationProp>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [payWhatYouCan, setPayWhatYouCan] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [tmdbId, setTmdbId] = useState<number | undefined>();
  const [existingMovieData, setExistingMovieData] = useState<any>(null);

  const loadEvent = async () => {
    try {
      setLoading(true);
      console.log("📝 Loading event with ID:", eventId);
      const { data } = await api.get(`/events/${eventId}`);

      setTitle(data.title);
      setDescription(data.description);
      setEventDate(new Date(data.date));
      setLocation(data.location);
      setMaxCapacity(data.maxCapacity?.toString() || "");

      // Convert cents to pounds for display
      setPrice(convertPriceToPounds(data.price));
      setMinPrice(convertPriceToPounds(data.minPrice));
      setPayWhatYouCan(data.payWhatYouCan || false);

      if (data.movieData) {
        setExistingMovieData(data.movieData);
        setTmdbId(data.movieData.tmdbId);
      }
    } catch (error: any) {
      console.error("Failed to load event:", error);
      console.error("Event ID was:", eventId);
      console.error("Error response:", error.response?.data);
      Alert.alert("Error", "Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

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

      // Handle movie data
      let movieData = null;

      if (existingMovieData && existingMovieData.tmdbId === tmdbId) {
        // Movie hasn't changed, use existing data
        movieData = existingMovieData;
      } else if (tmdbId) {
        // New movie selected or changed, fetch fresh data
        try {
          const { data } = await api.get(`/movies/${tmdbId}`);
          movieData = data;
        } catch (error) {
          console.error("Failed to fetch movie details:", error);
        }
      }

      const updatePayload: any = {
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
        updatePayload.movieData = movieData;
      }

      await api.put(`/events/${eventId}`, updatePayload);

      Alert.alert("Success", "Event updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      const errorMsg = error.response?.data?.error || "Failed to update event";
      Alert.alert("Error", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (eventId && eventId.trim()) {
      loadEvent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return {
    loading,
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
      existingMovieData,
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
    setExistingMovieData,
    handleSubmit,
    loadEvent,
  };
};
