import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { ShieldCheckIcon, XMarkIcon } from "react-native-heroicons/outline";
import { theme } from "../../../../theme";
import { styles } from "../LoginScreen.styles";

interface AdminInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AdminInfoModal: React.FC<AdminInfoModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <ShieldCheckIcon
              size={28}
              color={theme.colors.primary}
              style={styles.modalIcon}
            />
            <Text style={styles.modalTitle}>Admin Account</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <XMarkIcon size={24} color={theme.colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalText}>
            This is an <Text style={styles.modalBold}>admin account</Text> with
            special privileges.
          </Text>
          <Text style={styles.modalText}>
            Admin accounts are <Text style={styles.modalBold}>invite-only</Text>{" "}
            and grant the ability to:
          </Text>
          <View style={styles.modalList}>
            <Text style={styles.modalListItem}>• Create new events</Text>
            <Text style={styles.modalListItem}>• Edit existing events</Text>
            <Text style={styles.modalListItem}>• Delete events</Text>
            <Text style={styles.modalListItem}>• Manage attendees</Text>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};
