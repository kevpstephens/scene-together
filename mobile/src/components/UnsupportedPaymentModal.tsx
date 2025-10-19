import React from "react";
import { Modal, View, Text } from "react-native";
import { styles } from "./UnsupportedPaymentModal.styles";

/**
 * UnsupportedPaymentModal
 * ----------------------------------------------
 * Explains that card payments are disabled in the web/Expo Go demo
 * and are only available in a native development build or published app.
 */
type Props = {
  /** Controls modal visibility */
  visible: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /** Optional handler for a "Learn more" link */
  onLearnMore?: () => void;
};

export default function UnsupportedPaymentModal({
  visible,
  onClose,
  onLearnMore,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text style={styles.title}>Payments unavailable in this demo</Text>
          <Text style={styles.body}>
            For this portfolio demo, card payments are disabled on the web and
            in Expo Go. Payments work in a native development build or a
            published app. You can still RSVP and explore the full experience.
          </Text>
          <View style={styles.actions}>
            {onLearnMore ? (
              <Text style={styles.link} onPress={onLearnMore}>
                Learn more
              </Text>
            ) : null}
            <Text style={styles.primary} onPress={onClose}>
              Got it
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
