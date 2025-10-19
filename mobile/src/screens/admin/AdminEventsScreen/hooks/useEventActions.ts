/*===============================================
 * useEventActions Hook - AdminEventsScreen
 * ==============================================
 * Manages admin event actions like delete and error handling.
 * Includes confirmation alerts and optimistic UI updates.
 * ==============================================
 */

import { useState } from "react";
import { Alert } from "react-native";
import { api } from "../../../../services/api";
import type { Event } from "../../../../types";

interface UseEventActionsProps {
  events: Event[];
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
}

export interface UseEventActionsReturn {
  deleting: string | null;
  confirmDelete: Event | null;
  handleDelete: (event: Event) => void;
  confirmDeleteEvent: () => Promise<void>;
  cancelDelete: () => void;
}

export const useEventActions = ({
  events,
  setEvents,
}: UseEventActionsProps): UseEventActionsReturn => {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Event | null>(null);

  const handleDelete = (event: Event) => {
    setConfirmDelete(event);
  };

  const confirmDeleteEvent = async () => {
    if (!confirmDelete) return;

    setDeleting(confirmDelete.id);
    setConfirmDelete(null);

    try {
      await api.delete(`/events/${confirmDelete.id}`);
      setEvents(events.filter((e) => e.id !== confirmDelete.id));
      Alert.alert("Success", "Event deleted successfully");
    } catch (error: any) {
      console.error("❌ Failed to delete event:", error);
      console.error("Error response:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Failed to delete event"
      );
    } finally {
      setDeleting(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  return {
    deleting,
    confirmDelete,
    handleDelete,
    confirmDeleteEvent,
    cancelDelete,
  };
};
