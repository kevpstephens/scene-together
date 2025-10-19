import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { styles } from "../AdminEventsScreen.styles";

interface DeleteConfirmModalProps {
  visible: boolean;
  eventTitle: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  eventTitle,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>⚠️ Delete Event?</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete "{eventTitle}"?
          </Text>
          <Text style={[styles.modalMessage, styles.modalWarning]}>
            This action cannot be undone. All RSVPs and attendee data will be
            permanently deleted.
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonCancel]}
              onPress={onCancel}
            >
              <Text style={styles.modalButtonTextCancel}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonDelete]}
              onPress={onConfirm}
            >
              <Text style={styles.modalButtonTextDelete}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
