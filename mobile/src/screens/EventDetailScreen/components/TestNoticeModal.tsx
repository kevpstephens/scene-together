import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import AnimatedButton from "../../../components/AnimatedButton";
import { theme } from "../../../theme";
import { styles } from "../EventDetailScreen.styles";

interface TestNoticeModalProps {
  visible: boolean;
  dontShowAgain: boolean;
  onDontShowAgainChange: (value: boolean) => void;
  onClose: () => void;
  onConfirm: () => void;
  showToast: (message: string, type: "success" | "error" | "info") => void;
}

export const TestNoticeModal: React.FC<TestNoticeModalProps> = ({
  visible,
  dontShowAgain,
  onDontShowAgainChange,
  onClose,
  onConfirm,
  showToast,
}) => {
  const copyCard = async (cardNumber: string, displayNumber: string) => {
    try {
      await Clipboard.setStringAsync(cardNumber);
      showToast("Card copied!", "success");
    } catch (_) {
      showToast("Copy failed", "error");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Demo payment</Text>
          <Text style={styles.modalSubtitle}>
            This app is in Test Mode. Use Stripe test cards only.
          </Text>

          <View style={styles.testCardsContainer}>
            <Text style={styles.sectionTitle}>Common test cards</Text>
            <View style={{ gap: 12 }}>
              <View style={styles.testCardRow}>
                <Text style={styles.testCardNumber}>4242 4242 4242 4242</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyCard("4242424242424242", "4242 4242 4242 4242")
                  }
                  style={styles.copyChip}
                >
                  <Text style={styles.copyChipText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.testCardHint}>
                Expiry: any future, CVC: 123
              </Text>
              <View style={styles.testCardRow}>
                <Text style={styles.testCardNumber}>4000 0027 6000 3184</Text>
                <TouchableOpacity
                  onPress={() =>
                    copyCard("4000002760003184", "4000 0027 6000 3184")
                  }
                  style={styles.copyChip}
                >
                  <Text style={styles.copyChipText}>Copy</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.testCardHint}>(3D Secure test)</Text>
            </View>
          </View>

          {/* Only show "Don't show again" in production builds */}
          {!__DEV__ && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => onDontShowAgainChange(!dontShowAgain)}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  borderWidth: 2,
                  borderColor: theme.colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                {dontShowAgain && (
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </TouchableOpacity>
              <Text style={styles.description}>Don't show again</Text>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={onClose}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <AnimatedButton
              style={styles.modalConfirmButton}
              onPress={onConfirm}
            >
              <Text style={styles.modalConfirmButtonText}>Continue</Text>
            </AnimatedButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};
